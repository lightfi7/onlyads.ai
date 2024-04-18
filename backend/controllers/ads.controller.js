const db = require("../models");
const fs = require("fs");
const axios = require("axios");
const { response } = require("express");
const User = db.user;
const Ads = db.ads;
const Membership = db.membership;

exports.findAll = async (req, res) => {
  try {
    const expired = req.expired;
    const membership = req.membership;

    let {
      type = "youtube",
      q = "",
      qt = "keyword",
      sortBy = "desc",
      perPage = 12,
      page = 1,
      impression = [],
      likes = [],
      popularity = [],
      days = [],
      languages = [],
      countries = [],
      date = [],
    } = req.body;

    languages = languages.map((l) => l.value);
    countries = countries.map((c) => c.value);

    let sort_id = -1;
    if (sortBy == "desc") {
      sort_id = -1;
    } else sort_id = 1;

    const queryLowered = q.toLowerCase();

    let publisher;
    switch (type) {
      case "youtube":
        publisher = 7;
        break;
      case "tiktok":
        publisher = 43;
        break;
      case "facebook":
        publisher = 1;
        break;
      case "all":
        publisher = 0;
        break;
      case "instagram":
        publisher = 5;
        break;
      case "twitter":
        publisher = 2;
        break;
      case "pinterest":
        publisher = 4;
        break;
      case "admob":
        publisher = 3;
        break;
      case "yahoo":
        publisher = 6;
        break;
      default:
        publisher = 0;
        break;
    }

    let skip = perPage * (page - 1);

    if (expired && req.role == "user") {
      skip = 0;
      perPage = 12;
    }

    const queries = [
      {
        $addFields: {
          impressionp: {
            $cond: {
              if: { $regexMatch: { input: "$impression", regex: /K$/i } },
              then: {
                $multiply: [
                  {
                    $toDouble: { $trim: { input: "$impression", chars: "K " } },
                  },
                  1000,
                ],
              },
              else: {
                $cond: {
                  if: { $regexMatch: { input: "$impression", regex: /M$/i } },
                  then: {
                    $multiply: [
                      {
                        $toDouble: {
                          $trim: { input: "$impression", chars: "M " },
                        },
                      },
                      1000000,
                    ],
                  },
                  else: { $toDouble: "$impression" },
                },
              },
            },
          },
        },
      },
      {
        $addFields: {
          like_countp: {
            $cond: {
              if: { $regexMatch: { input: "$like_count", regex: /K$/i } },
              then: {
                $multiply: [
                  {
                    $toDouble: { $trim: { input: "$like_count", chars: "K " } },
                  },
                  1000,
                ],
              },
              else: {
                $cond: {
                  if: { $regexMatch: { input: "$like_count", regex: /M$/i } },
                  then: {
                    $multiply: [
                      {
                        $toDouble: {
                          $trim: { input: "$like_count", chars: "M " },
                        },
                      },
                      1000000,
                    ],
                  },
                  else: { $toDouble: "$like_count" },
                },
              },
            },
          },
        },
      },
      {
        $addFields: {
          popularityp: {
            $cond: {
              if: { $regexMatch: { input: "$heat", regex: /K$/i } },
              then: {
                $multiply: [
                  { $toDouble: { $trim: { input: "$heat", chars: "K " } } },
                  1000,
                ],
              },
              else: {
                $cond: {
                  if: { $regexMatch: { input: "$heat", regex: /M$/i } },
                  then: {
                    $multiply: [
                      { $toDouble: { $trim: { input: "$heat", chars: "M " } } },
                      1000000,
                    ],
                  },
                  else: { $toDouble: "$heat" },
                },
              },
            },
          },
        },
      },
      // {
      //   $addFields: {
      //     days_countp: {
      //       $cond: {
      //         if: { $regexMatch: { input: "$days_count", regex: /K$/i } },
      //         then: {
      //           $multiply: [
      //             {
      //               $toDouble: { $trim: { input: "$days_count", chars: "K " } },
      //             },
      //             1000,
      //           ],
      //         },
      //         else: {
      //           $cond: {
      //             if: { $regexMatch: { input: "$days_count", regex: /M$/i } },
      //             then: {
      //               $multiply: [
      //                 {
      //                   $toDouble: {
      //                     $trim: { input: "$days_count", chars: "M " },
      //                   },
      //                 },
      //                 1000000,
      //               ],
      //             },
      //             else: { $toDouble: "$days_count" },
      //           },
      //         },
      //       },
      //     },
      //   },
      // },
      {
        $addFields: {
          createdDate: {
            $dateFromString: {
              dateString: "$first_seen",
            },
          },
        },
      },
      {
        $sort: {
          createdDate: sort_id,
          createdAt: -1,
        },
      },
    ];

    if (qt == "keyword") {
      queries.push({
        $match: {
          title: new RegExp(queryLowered, "i"),
        },
      });
    } else if (qt == "text") {
      queries.push({
        $match: {
          body: new RegExp(queryLowered, "i"),
        },
      });
    } else if (qt == "advertiser") {
      queries.push({
        $match: {
          advertiser_name: new RegExp(queryLowered, "i"),
        },
      });
    } else if (qt == "link") {
      queries.push({
        $match: {
          domain: new RegExp(queryLowered, "i"),
        },
      });
    }

    if (publisher != 0) {
      queries.push({
        $match: {
          platform: publisher,
        },
      });
    }

    if (impression.length > 0) {
      queries.push({
        $match: {
          impressionp: {
            $gte: impression[0],
            $lte: impression[1],
          },
        },
      });
    }

    if (likes.length > 0) {
      queries.push({
        $match: {
          like_countp: {
            $gte: likes[0],
            $lte: likes[1],
          },
        },
      });
    }

    if (popularity.length > 0) {
      queries.push({
        $match: {
          popularityp: {
            $gte: popularity[0],
            $lte: popularity[1],
          },
        },
      });
    }

    if (days.length > 0) {
      let now = new Date();
      const daysFrom = new Date(now.setDate(now.getDate() - days[1]));
      now = new Date();
      const daysTo = new Date(now.setDate(now.getDate() - days[0]));
      queries.push({
        $match: {
          $expr: {
            $and: [
              {
                $gte: [
                  { $dateFromString: { dateString: "$first_seen" } },
                  daysFrom,
                ],
              },
              {
                $lte: [
                  { $dateFromString: { dateString: "$first_seen" } },
                  daysTo,
                ],
              },
            ],
          },
        },
      });
    }

    if (languages.length > 0) {
      queries.push({
        $match: {
          language: { $in: languages },
        },
      });
    }

    if (countries.length > 0) {
      queries.push({
        $match: {
          countries: { $in: countries },
        },
      });
    }
    if (date.length > 0) {
      let startDate = new Date(date[0]);
      let endDate = new Date(date[1]);

      queries.push({
        $match: {
          $expr: {
            $and: [
              {
                $gte: [
                  { $dateFromString: { dateString: "$first_seen" } },
                  startDate,
                ],
              },
              {
                $lte: [
                  { $dateFromString: { dateString: "$first_seen" } },
                  endDate,
                ],
              },
            ],
          },
        },
      });
    }

    queries.push({
      $facet: {
        metadata: [{ $count: "total" }],
        data: [{ $skip: skip || 0 }, { $limit: perPage || 12 }],
      },
    });

    const response = await axios.post(`http://34.30.29.35/db/ads`, {
      queries,
    });

    res.status(200).send(response.data);

    // Ads.aggregate(queries)
    //   .allowDiskUse(true)
    //   .then((data) => {
    //     let total = 12;
    //     if (data[0].metadata.length) total = data[0].metadata[0].total;
    //     res.status(200).send({
    //       total,
    //       ads: data[0].data,
    //     });
    //   });
  } catch (err) {
    console.log(err);
    res.status(500).send("Faild to get ads, try again or contact!");
  }
};

exports.findOne = async (req, res) => {
  try {
    if (req.perm == "user") {
      let today = new Date();
      today.setHours(0, 0, 0);
      const membership = req.membership;
      if (!membership)
        return res.send({
          code: 403,
          message: "No membership",
        });
      if (membership.limit.date.getDate() != today.getDate()) {
        membership.limit.n = 0;
        membership.limit.date = today.getDate();
      }
      let limitCount = membership.limit.n;
      let limited = false;
      switch (membership?.type) {
        case "Basic":
          if (limitCount < 50) limitCount++;
          else limited = true;
          break;
        case "Standard":
          if (limitCount < 200) limitCount++;
          else limited = true;
          break;
        case "Enterprise":
          if (limitCount < 1000) limitCount++;
          else limited = true;
          break;
        default:
          limited = true;
          break;
      }

      membership.limit.n = limitCount;
      await membership.save();

      if (limited) {
        return res.send({
          code: 402,
          message: "Limit exceeded",
        });
      }
    }
    req.redis.get(req.params.id, async function (err, result) {
      if (err) {
        console.log(err);
        return res.status(500).send({
          code: 401,
          message: err.message,
        });
      }
      let data = JSON.parse(result);
      let h = new Date().getHours();
      if (!data) {
        try {
          ad = await Ads.findOne({ _id: req.params.id });
          if (!ad) {
            return res.status(500).send({
              code: 500,
              message: "not found",
            });
          }

          data = ad;

          if ((h > 0 && h < 4) || (h > 8 && h < 12) || (h > 16 && h < 20)) {
            data = ad;
          } else {
            axios
              .get(`http://localhost:5001/api/information?id=${req.params.id}`)
              .then((response) => response.data)
              .then((response) => {
                if (response.code === 200) {
                  if (response.data.length) {
                    data = response.data;
                    data.logo_url = ad.logo_url;
                    data.resource_urls = ad.resource_urls;
                    req.redis.set(req.params.id, JSON.stringify(data));
                    req.redis.expire(req.params.id, 3600 * 24);
                    Ads.findOneAndUpdate({ id: req.params.id }, data)
                      .then((data) => {
                        console.log(";)");
                      })
                      .catch((err) => {
                        console.log(err.message);
                      });
                  }
                }
              })
              .catch((err) => console.log(err));
          }
        } catch (err) {
          console.log(err);
          return res.status(500).send({
            code: 500,
            message: err.message,
          });
        }
      }
      res.send({
        code: 200,
        data,
      });
    });
  } catch (err) {
    console.log(err);
    res.status(500).send("Faild to get ad, try again or contact!");
  }
};

exports.delete = (req, res) => {};
