import {
  Alert,
  AlertTitle,
  Avatar,
  Box,
  Breadcrumbs,
  Button,
  Chip,
  Divider,
  Grid,
  Link,
  Stack,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import ReactPlayer from "react-player";
import { useParams } from "react-router-dom";
import axios from "../../services/axios";

import VideocamIcon from "@mui/icons-material/Videocam";
import youtubeIcon from "../../assets/icons/youtube-svgrepo-com.svg";
import tiktokIcon from "../../assets/icons/tiktok-logo-4500.svg";
import facebookIcon from "../../assets/icons/facebook-svgrepo-com.svg";
import admobIcon from "../../assets/icons/icons8-google-admob.svg";
import twitterIcon from "../../assets/icons/icons8-twitter.svg";
import instagramIcon from "../../assets/icons/icons8-instagram.svg";
import pinterestIcon from "../../assets/icons/icons8-pinterest.svg";
import yahooIcon from "../../assets/icons/icons8-yahoo.svg";
import androidIcon from "../../assets/icons/android-svgrepo-com.svg";
import appleIcon from "../../assets/icons/apple-logo-svgrepo-com.svg";
import desktopIcon from "../../assets/icons/desktop-computer-svgrepo-com.svg";

const cJson = JSON.parse(
  '[{"label":"United Arab Emirates","value":"ARE"},{"label":"Luxembourg","value":"LUX"},{"label":"Suriname","value":"SUR"},{"label":"Rwanda","value":"RWA"},{"label":"Switzerland","value":"CHE"},{"label":"El Salvador","value":"SLV"},{"label":"Faroe Islands","value":"FO"},{"label":"Mozambique","value":"MOZ"},{"label":"Bahamas","value":"BHS"},{"label":"Ghana","value":"GHA"},{"label":"Tuvalu","value":"TUV"},{"label":"Ethiopia","value":"ETH"},{"label":"Armenia","value":"ARM"},{"label":"Kenya","value":"KEN"},{"label":"Lebanon","value":"LBN"},{"label":"Malta","value":"MLT"},{"label":"Comoros","value":"COM"},{"label":"Micronesia","value":"FSM"},{"label":"Burkina Faso","value":"BFA"},{"label":"Mauritania","value":"MRT"},{"label":"Saint Martin","value":"MF"},{"label":"Sri Lanka","value":"LKA"},{"label":"Maldives","value":"MDV"},{"label":"Brazil","value":"BRA"},{"label":"Peru","value":"PER"},{"label":"Philippines","value":"PHL"},{"label":"South Georgia and The South Sandwich Islands","value":"GS"},{"label":"Paraguay","value":"PRY"},{"label":"Senegal","value":"SEN"},{"label":"St.Pierre and Miquelon","value":"SPM"},{"label":"Guyana","value":"GUY"},{"label":"Aland Islands","value":"AX"},{"label":"Singapore","value":"SGP"},{"label":"Nigeria","value":"NGA"},{"label":"Italy","value":"ITA"},{"label":"Argentina","value":"ARG"},{"label":"Tonga","value":"TON"},{"label":"New Caledonia","value":"NCL"},{"label":"Kuwait","value":"KWT"},{"label":"Gambia","value":"GMB"},{"label":"Madagascar","value":"MDG"},{"label":"Haiti","value":"HTI"},{"label":"Turks and Caicos Islands","value":"TC"},{"label":"France","value":"FRA"},{"label":"Bhutan","value":"BTN"},{"label":"Latvia","value":"LVA"},{"label":"Jamaica","value":"JAM"},{"label":"San Marino","value":"SMR"},{"label":"Czech","value":"CZE"},{"label":"French Southern Territories","value":"TF"},{"label":"Niue","value":"NU"},{"label":"Korea","value":"KOR"},{"label":"Liberia","value":"LBR"},{"label":"Zambia","value":"ZMB"},{"label":"Egypt","value":"EGY"},{"label":"Palau","value":"PLW"},{"label":"Guernsey","value":"GG"},{"label":"Portugal","value":"PRT"},{"label":"Bahrian","value":"BHR"},{"label":"Mali","value":"MLI"},{"label":"Denmark","value":"DNK"},{"label":"Marshall Is Rep","value":"MHL"},{"label":"Samoa","value":"WSM"},{"label":"Lithuania","value":"LTU"},{"label":"United States","value":"USA"},{"label":"Niger","value":"NER"},{"label":"Cambodia","value":"KHM"},{"label":"United States Minor Outlying Islands","value":"UM"},{"label":"Vietnam","value":"VNM"},{"label":"Finland","value":"FIN"},{"label":"Kazakhstan","value":"KAZ"},{"label":"Australia","value":"AUS"},{"label":"Cayman Is","value":"CYM"},{"label":"Vanuatu","value":"VUT"},{"label":"Albania","value":"ALB"},{"label":"Somalia","value":"SOM"},{"label":"Lesotho","value":"LSO"},{"label":"Moldavia","value":"MDA"},{"label":"Oman","value":"OMN"},{"label":"Georgia","value":"GEO"},{"label":"Guam","value":"GU"},{"label":"Turkey","value":"TUR"},{"label":"Slovak","value":"SVK"},{"label":"Wallis and Futuna Islands","value":"WF"},{"label":"India","value":"IND"},{"label":"Kosovo","value":"XK"},{"label":"Brunei","value":"BRN"},{"label":"Bangladesh","value":"BGD"},{"label":"Ireland","value":"IRL"},{"label":"Jordan","value":"JOR"},{"label":"Japan","value":"JPN"},{"label":"Ecuador","value":"ECU"},{"label":"Spain","value":"ESP"},{"label":"Zimbabwe","value":"ZWE"},{"label":"Panama","value":"PAN"},{"label":"Belarus","value":"BLR"},{"label":"East Timor","value":"TMP"},{"label":"Solomon Is","value":"SLB"},{"label":"Iceland","value":"ISL"},{"label":"Tajikistan","value":"TJK"},{"label":"Western Sahara","value":"ESH"},{"label":"Reunion","value":"REU"},{"label":"South Africa","value":"ZAF"},{"label":"Botswana","value":"BWA"},{"label":"Colombia","value":"COL"},{"label":"Guinea","value":"GIN"},{"label":"British Indian Ocean Territory","value":"IO"},{"label":"Nicaragua","value":"NIC"},{"label":"Cameroon","value":"CMR"},{"label":"Azerbaijan","value":"AZE"},{"label":"Greenland","value":"GRL"},{"label":"Myanmar","value":"MMR"},{"label":"Kiribati","value":"KIR"},{"label":"Bulgaria","value":"BGR"},{"label":"Christmas Island","value":"CX"},{"label":"Trinidad and Tobago","value":"TTO"},{"label":"Austria","value":"AUT"},{"label":"Gibraltar","value":"GIB"},{"label":"Norway","value":"NOR"},{"label":"Iraq","value":"IRQ"},{"label":"Liechtenstein","value":"LIE"},{"label":"Chad","value":"TCD"},{"label":"Mongolia","value":"MNG"},{"label":"French Polynesia","value":"PYF"},{"label":"Thailand","value":"THA"},{"label":"Eq.Guinea","value":"GNQ"},{"label":"Saint Lucia","value":"LC"},{"label":"Bermuda","value":"BMU"},{"label":"French Guiana","value":"GF"},{"label":"Cape Verde","value":"CPV"},{"label":"Honduras","value":"HND"},{"label":"Fiji","value":"FJI"},{"label":"Nauru","value":"NRU"},{"label":"Togo","value":"TGO"},{"label":"Uruguay","value":"URY"},{"label":"Cyprus","value":"CYP"},{"label":"Ukraine","value":"UKR"},{"label":"Monaco","value":"MCO"},{"label":"Andorra","value":"AND"},{"label":"Laos","value":"LAO"},{"label":"Uganda","value":"UGA"},{"label":"Cote d\'lvoire","value":"CIV"},{"label":"Gabon","value":"GAB"},{"label":"Benin","value":"BEN"},{"label":"Israel","value":"ISR"},{"label":"Saudi Arabia","value":"SAU"},{"label":"Norfolk Island","value":"NF"},{"label":"Germany","value":"DEU"},{"label":"Croatia","value":"HRV"},{"label":"Palestine","value":"PAL"},{"label":"Swaziland","value":"SWZ"},{"label":"Qatar","value":"QAT"},{"label":"Malawi","value":"MWI"},{"label":"Sierra Leone","value":"SLE"},{"label":"Slovenia","value":"SVN"},{"label":"Uzbekistan","value":"UZB"},{"label":"Romania","value":"ROM"},{"label":"Curaçao","value":"CW"},{"label":"Dominican","value":"DOM"},{"label":"Seychelles","value":"SYC"},{"label":"Netherlands","value":"NLD"},{"label":"Indonesia","value":"IDN"},{"label":"Hungary","value":"HUN"},{"label":"Turkmenistan","value":"TKM"},{"label":"Greece","value":"GRC"},{"label":"Bosnia Hercegovina","value":"BIH"},{"label":"Malaysia","value":"MYS"},{"label":"Morocco","value":"MAR"},{"label":"Yemen","value":"YEM"},{"label":"Burundi","value":"BDI"},{"label":"Macedonia","value":"MKD"},{"label":"Tanzania","value":"TZA"},{"label":"Chile","value":"CHL"},{"label":"Kirghizia","value":"KGZ"},{"label":"Venezuela","value":"VEN"},{"label":"Belize","value":"BLZ"},{"label":"China","value":"CHN"},{"label":"Grenada","value":"GRD"},{"label":"Djibouti","value":"DJI"},{"label":"Cook Is","value":"COK"},{"label":"Belgium","value":"BEL"},{"label":"Sweden","value":"SWE"},{"label":"New Zealand","value":"NZL"},{"label":"Mexico","value":"MEX"},{"label":"Pakistan","value":"PAK"},{"label":"Poland","value":"POL"},{"label":"Eritrea","value":"ERI"},{"label":"Mauritius","value":"MUS"},{"label":"United Kingdom","value":"ENG"},{"label":"Estonia","value":"EST"},{"label":"Bolivia","value":"BOL"},{"label":"Costa Rica","value":"CRI"},{"label":"Angola","value":"AGO"},{"label":"Afghanistan","value":"AFG"},{"label":"Canada","value":"CAN"},{"label":"Tunisia","value":"TUN"},{"label":"Puerto Rico","value":"PTR"},{"label":"Sao Tome and Principe","value":"STP"},{"label":"Jersey","value":"JE"},{"label":"Papua New Guinea","value":"PNG"},{"label":"Guatemala","value":"GTM"},{"label":"Algeria","value":"DZA"},{"label":"Namibia","value":"NAM"},{"label":"Hong Kong SAR","value":"HKG"},{"label":"Macau SAR","value":"MAC"},{"label":"Taiwan,China","value":"TWN"},{"label":"Nepal","value":"NPL"},{"label":"Russia","value":"RUS"}]'
);

const getCountryByVal = (value) => {
  for (let i = 0; i < cJson.length; i++) {
    if (cJson[i].value === value) {
      return cJson[i].label;
    }
  }
  return null;
};

const getNetworkValue = (platform) => {
  switch (platform) {
    case 7:
      return <img src={youtubeIcon} style={{ width: 20, height: 20 }} />;
    case 43:
      return <img src={tiktokIcon} style={{ width: 20, height: 20 }} />;
    case 1:
      return <img src={facebookIcon} style={{ width: 20, height: 20 }} />;
    case 5:
      return <img src={instagramIcon} style={{ width: 20, height: 20 }} />;
    case 2:
      return <img src={twitterIcon} style={{ width: 20, height: 20 }} />;
    case 4:
      return <img src={pinterestIcon} style={{ width: 20, height: 20 }} />;
    case 3:
      return <img src={admobIcon} style={{ width: 20, height: 20 }} />;
    case 6:
      return <img src={facebookIcon} style={{ width: 20, height: 20 }} />;
    default:
      return <img src={yahooIcon} style={{ width: 20, height: 20 }} />;
  }
};

const getOSValue = (id) => {
  switch (id) {
    case 1:
      return <img src={appleIcon} style={{ width: 20, height: 20 }} />;
    case 2:
      return <img src={androidIcon} style={{ width: 20, height: 20 }} />;
    case 3:
      return <img src={desktopIcon} style={{ width: 20, height: 20 }} />;
    default:
      return <img src={desktopIcon} style={{ width: 20, height: 20 }} />;
  }
};

const handleDownload = (url) => {
  const link = document.createElement("a");
  link.href = url;
  link.download = "video.mp4";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export default function AdDetails() {
  const [videoPlayer, setVideoPlayer] = useState();
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [code, setCode] = useState(null);

  useEffect(() => {
    axios
      .get(`/api/dd/${id}`)
      .then((res) => {
        setData(res.data.data);
        setCode(res.data.code);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  useEffect(() => {
    setVideoPlayer(
      <ReactPlayer
        controls={true}
        playing
        width={"100%"}
        style={{
          boxShadow: "0 0 20px rgba(0,0,0,0.02)",
        }}
        url={data?.resource_urls[0]?.s3_video_url + `?v=${Date.now()}`}
      />
    );
  }, [data]);

  if (code == 402)
    return (
      <Box>
        <Alert severity="info">
          <AlertTitle>You have reached your daily limit.</AlertTitle>
          You need to upgrade plan or try later.
          <Link href="/ads"> To Dashboard</Link>
        </Alert>
      </Box>
    );
  if (code === 403)
    return (
      <Box>
        <Alert severity="warning">
          <AlertTitle>You haven't any membership.</AlertTitle>
          To get more results, please upgrade plan. Click
          <a href="/pricing">here</a>
        </Alert>
      </Box>
    );

  if (code === 404)
    return (
      <Box>
        <Alert severity="error">
          <AlertTitle>Ad not found</AlertTitle>
          AD with ID: {id} doesn't exist.{" "}
          <Link href="/ads">To Dashboard</Link>
        </Alert>
      </Box>
    );

  return (
    <>
      <Breadcrumbs aria-label="breadcrumb">
        <Link underline="hover" color="inherit" href="/" fontSize={18}>
          App
        </Link>
        <Link underline="hover" color="inherit" href="/" fontSize={18}>
          Dashboard
        </Link>
        <Typography color="text.primary" fontSize={18}>
          Details
        </Typography>
      </Breadcrumbs>
      <Box
        sx={{
          my: 4,
        }}
      >
        {code == 200 && (
          <>
            <Box
              sx={{
                pt: 4,
                display: "flex",
                alignItems: "center",
                gap: 2,
              }}
            >
              <Avatar src={data.logo_url} alt={data.advertiser_name} />
              <Typography fontSize={{ xs: 18, sm: 24, lg: 32 }}>
                {data.advertiser_name}
              </Typography>
            </Box>
            <Box>
              <Grid container spacing={4}>
                <Grid item xs={12} lg={7}>
                  <Box
                    sx={{
                      mt: 4,
                      display: "flex",
                      flexDirection: "column",
                      gap: 2,
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: {
                          xs: 14,
                          sm: 16,
                          lg: 18,
                        },
                        whiteSpace: "balance",
                        textOverflow: "ellipsis",
                        overflow: "hidden",
                        textWrap: "nowrap",
                        width: "75%",
                      }}
                    >
                      {data.title}
                    </Typography>
                    {videoPlayer}
                    <Typography
                      sx={{
                        fontSize: {
                          xs: 12,
                          sm: 14,
                          lg: 16,
                        },
                        wordBreak: "break-word",
                      }}
                    >
                      {data.body}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} lg={5}>
                  <Box>
                    <Grid container spacing={2}>
                      <Grid
                        item
                        xs={4}
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          gap: 1,
                        }}
                      >
                        <Typography
                          sx={{
                            fontSize: {
                              xs: 18,
                              sm: 20,
                              lg: 24,
                            },
                          }}
                        >
                          {data.impression}
                        </Typography>
                        <Typography
                          fontSize={{
                            xs: 16,
                            sm: 18,
                            lg: 20,
                          }}
                          color={"gray"}
                        >
                          Impression
                        </Typography>
                      </Grid>
                      <Grid
                        item
                        xs={4}
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          gap: 1,
                        }}
                      >
                        <Typography
                          sx={{
                            fontSize: {
                              xs: 18,
                              sm: 20,
                              lg: 24,
                            },
                          }}
                        >
                          {data.heat}
                        </Typography>
                        <Typography
                          fontSize={{
                            xs: 16,
                            sm: 18,
                            lg: 20,
                          }}
                          color={"gray"}
                        >
                          Popularity
                        </Typography>
                      </Grid>
                      <Grid
                        item
                        xs={4}
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          gap: 1,
                        }}
                      >
                        <Typography
                          sx={{
                            fontSize: {
                              xs: 18,
                              sm: 20,
                              lg: 24,
                            },
                          }}
                        >
                          {data.days_count}
                        </Typography>
                        <Typography
                          fontSize={{
                            xs: 16,
                            sm: 18,
                            lg: 20,
                          }}
                          color={"gray"}
                        >
                          Days
                        </Typography>
                      </Grid>
                    </Grid>
                  </Box>
                  <Divider
                    sx={{
                      m: 4,
                    }}
                  />
                  <Stack spacing={1} direction={"column"} sx={{}}>
                    <Box
                      sx={{
                        display: "flex",
                        gap: 2,
                        alignItems: "center",
                        justifyContent: {
                          xs: "space-between",
                          sm: "stretch",
                          md: "flex-start",
                        },
                      }}
                    >
                      <Box
                        sx={{
                          minWidth: {
                            xs: 100,
                            sm: 120,
                            md: 180,
                          },
                        }}
                      >
                        <Typography
                          sx={{
                            fontWeight: 500,
                            fontSize: {
                              xs: 14,
                              md: 16,
                              lg: 18,
                            },
                          }}
                        >
                          Duration :
                        </Typography>
                      </Box>
                      <Box>
                        <Typography fontSize={14}>
                          {data.first_seen} - {data.last_seen}
                        </Typography>
                      </Box>
                    </Box>
                    <Box
                      sx={{
                        display: "flex",
                        gap: 2,
                        alignItems: "center",
                        justifyContent: {
                          xs: "space-between",
                          sm: "stretch",
                          md: "flex-start",
                        },
                      }}
                    >
                      <Box
                        sx={{
                          minWidth: {
                            xs: 100,
                            sm: 120,
                            md: 180,
                          },
                        }}
                      >
                        <Typography
                          sx={{
                            fontWeight: 500,
                            fontSize: {
                              xs: 14,
                              md: 16,
                              lg: 18,
                            },
                          }}
                        >
                          Network :
                        </Typography>
                      </Box>
                      <Box>
                        <Typography fontSize={14}>
                          {getNetworkValue(data.platform)}
                        </Typography>
                      </Box>
                    </Box>
                    <Box
                      sx={{
                        display: "flex",
                        gap: 2,
                        alignItems: "center",
                        justifyContent: {
                          xs: "space-between",
                          sm: "stretch",
                          md: "flex-start",
                        },
                      }}
                    >
                      <Box
                        sx={{
                          minWidth: {
                            xs: 100,
                            sm: 120,
                            md: 180,
                          },
                        }}
                      >
                        <Typography
                          sx={{
                            fontWeight: 500,
                            fontSize: {
                              xs: 14,
                              md: 16,
                              lg: 18,
                            },
                          }}
                        >
                          OS :
                        </Typography>
                      </Box>
                      <Box>{getOSValue(data.os)}</Box>
                    </Box>
                    <Box
                      sx={{
                        display: "flex",
                        gap: 2,
                        alignItems: "center",
                        justifyContent: {
                          xs: "space-between",
                          sm: "stretch",
                          md: "flex-start",
                        },
                      }}
                    >
                      <Box
                        sx={{
                          minWidth: {
                            xs: 100,
                            sm: 120,
                            md: 180,
                          },
                        }}
                      >
                        <Typography
                          sx={{
                            fontWeight: 500,
                            fontSize: {
                              xs: 14,
                              md: 16,
                              lg: 18,
                            },
                          }}
                        >
                          Related Ads :
                        </Typography>
                      </Box>
                      <Box>
                        <Typography fontSize={14}>{data.relate_ads}</Typography>
                      </Box>
                    </Box>
                    <Box
                      sx={{
                        display: "flex",
                        gap: 2,
                        alignItems: "center",
                        justifyContent: {
                          xs: "space-between",
                          sm: "stretch",
                          md: "flex-start",
                        },
                      }}
                    >
                      <Box
                        sx={{
                          minWidth: {
                            xs: 100,
                            sm: 120,
                            md: 180,
                          },
                        }}
                      >
                        <Typography
                          sx={{
                            fontWeight: 500,
                            fontSize: {
                              xs: 14,
                              md: 16,
                              lg: 18,
                            },
                          }}
                        >
                          Country/Region :
                        </Typography>
                      </Box>
                      <Box
                        sx={{
                          display: "inline-block",
                          alignItems: "center",
                        }}
                      >
                        {data.countries.map((country, key) => {
                          return (
                            <Chip
                              key={key}
                              label={getCountryByVal(country)}
                              size="small"
                            />
                          );
                        })}
                      </Box>
                    </Box>
                    <Box
                      sx={{
                        display: "flex",
                        gap: 2,
                        alignItems: "center",
                        justifyContent: {
                          xs: "space-between",
                          sm: "stretch",
                          md: "flex-start",
                        },
                      }}
                    >
                      <Box
                        sx={{
                          minWidth: {
                            xs: 100,
                            sm: 120,
                            md: 180,
                          },
                        }}
                      >
                        <Typography
                          sx={{
                            fontWeight: 500,
                            fontSize: {
                              xs: 14,
                              md: 16,
                              lg: 18,
                            },
                          }}
                        >
                          Language :
                        </Typography>
                      </Box>
                      <Box>
                        <Typography fontSize={14}>{data.language}</Typography>
                      </Box>
                    </Box>
                    <Box
                      sx={{
                        display: "flex",
                        gap: 2,
                        alignItems: "center",
                        justifyContent: {
                          xs: "space-between",
                          sm: "stretch",
                          md: "flex-start",
                        },
                      }}
                    >
                      <Box
                        sx={{
                          minWidth: {
                            xs: 100,
                            sm: 120,
                            md: 180,
                          },
                        }}
                      >
                        <Typography
                          sx={{
                            fontWeight: 500,
                            fontSize: {
                              xs: 14,
                              md: 16,
                              lg: 18,
                            },
                          }}
                        >
                          Size :
                        </Typography>
                      </Box>
                      <Box>
                        <Typography fontSize={14}>
                          {data.ad_width}*{data.ad_height}
                        </Typography>
                      </Box>
                    </Box>
                    <Box
                      sx={{
                        display: "flex",
                        gap: 2,
                        alignItems: "center",
                        justifyContent: {
                          xs: "space-between",
                          sm: "stretch",
                          md: "flex-start",
                        },
                      }}
                    >
                      <Box
                        sx={{
                          minWidth: {
                            xs: 100,
                            sm: 120,
                            md: 180,
                          },
                        }}
                      >
                        <Typography
                          sx={{
                            fontWeight: 500,
                            fontSize: {
                              xs: 14,
                              md: 16,
                              lg: 18,
                            },
                          }}
                        >
                          Type :
                        </Typography>
                      </Box>
                      <Box>
                        <VideocamIcon />
                      </Box>
                    </Box>
                    <Box
                      sx={{
                        display: "flex",
                        gap: 2,
                        alignItems: "center",
                        justifyContent: {
                          xs: "space-between",
                          sm: "stretch",
                          md: "flex-start",
                        },
                      }}
                    >
                      <Box
                        sx={{
                          minWidth: {
                            xs: 100,
                            sm: 120,
                            md: 180,
                          },
                        }}
                      >
                        <Typography
                          sx={{
                            fontWeight: 500,
                            fontSize: {
                              xs: 14,
                              md: 16,
                              lg: 18,
                            },
                          }}
                        >
                          Original Post :
                        </Typography>
                      </Box>
                      <Box>
                        <Typography fontSize={14}>{data.source_url}</Typography>
                      </Box>
                    </Box>
                    <Box
                      sx={{
                        display: "flex",
                        gap: 2,
                        alignItems: "center",
                        justifyContent: {
                          xs: "space-between",
                          sm: "stretch",
                          md: "flex-start",
                        },
                      }}
                    >
                      <Box
                        sx={{
                          minWidth: {
                            xs: 100,
                            sm: 120,
                            md: 180,
                          },
                        }}
                      >
                        <Typography
                          sx={{
                            fontWeight: 500,
                            fontSize: {
                              xs: 14,
                              md: 16,
                              lg: 18,
                            },
                          }}
                        >
                          Engagement :
                        </Typography>
                      </Box>
                      <Box>
                        <Typography fontSize={14}>{data.relate_ads}</Typography>
                      </Box>
                    </Box>
                    <Box
                      sx={{
                        p: 4,
                        display: "flex",
                        flexDirection: {
                          xs: "column",
                          sm: "row",
                        },
                        gap: 2,
                      }}
                    >
                      {data?.store_url && (
                        <Button
                          variant="outlined"
                          size="large"
                          href={data?.store_url}
                          target="_blank"
                        >
                          Landing Page
                        </Button>
                      )}
                      <Button
                        variant="outlined"
                        size="large"
                        onClick={() =>
                          handleDownload(data?.resource_urls[0]?.s3_video_url)
                        }
                      >
                        Download
                      </Button>
                    </Box>
                  </Stack>
                </Grid>
              </Grid>
            </Box>
          </>
        )}
      </Box>
    </>
  );
}
