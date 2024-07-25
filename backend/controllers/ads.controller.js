const db = require("../models");
const axios = require("axios");
const Ads = db.ads;

exports.findAll = async (req, res) => {
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
  try {
    const expired = req.expired;
    const params = {
      type,
      q,
      qt,
      sortBy,
      perPage,
      page,
      impression,
      likes,
      popularity,
      days,
      languages,
      countries,
      date,
      expired,
      role: req.role,
    };
    const response = await axios.post(
      `${process.env.EXTRA_DB_API}/ads`,
      params
    );
    res.status(200).send(response.data);
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
                      .then(() => {
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

exports.delete = () => {};
