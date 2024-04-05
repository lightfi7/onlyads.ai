import * as React from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import { Avatar, Divider, Grid, IconButton, Tooltip } from "@mui/material";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import LanguageIcon from "@mui/icons-material/Language";
import PeopleIcon from "@mui/icons-material/People";

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

export default function AdCard({ data, handleClick }) {
  return (
    <Card variant="outlined" sx={{ minWidth: 275, cursor: "pointer" }}>
      <CardContent
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 0.6,
        }}
      >
        {/* Title */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 1,
            }}
          >
            <Avatar
              variant="square"
              src={data.logo_url}
              alt={data.advertiser_name}
            />
            <Typography variant="subtitle1">
              {data.advertiser_name.length > 20
                ? data.advertiser_name.substring(0, 20) + "..."
                : data.advertiser_name}
            </Typography>
          </Box>
          <IconButton>
            <StarBorderIcon />
          </IconButton>
        </Box>
        {/* Date */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
          <EventAvailableIcon color={"disabled"} />
          <Typography color={"gray"} variant="subtitle2">
            {data.first_seen} - {data.last_seen}
          </Typography>
        </Box>
        {/*  */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignContent: "center",
              gap: 1,
            }}
          >
            <LanguageIcon color="primary" />
            {/* {data.countries.map((country, key) => {
              return ( */}
            <Typography color={"gray"} variant="subtitle2">
              {getCountryByVal(data.countries[0])}
            </Typography>
            {/* );
            })} */}
          </Box>
          <Typography color={"gray"} variant="span">
            {data.language}
          </Typography>
        </Box>
        {/*  */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
          <PeopleIcon color="disabled" />
          <Tooltip title="Audience age: 44-45">
            <Typography color={"gray-700"} variant="span">
              {data.view_count}
            </Typography>
          </Tooltip>
        </Box>
        {/* Image */}
        <Box
          sx={{
            minHeight: 200,
            display: "flex",
            bgcolor: "#ccc",
          }}
          onClick={() => handleClick(data)}
        >
          <img
            src={data.resource_urls[0].s3_image_url}
            alt={
              data.title.length > 20
                ? data.title.substring(0, 20) + "..."
                : data.title
            }
            style={{
              margin: "auto",
              maxHeight: 200,
            }}
          />
        </Box>
        {/* Description */}
        <Box
          sx={{
            mt: 1,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 1,
          }}
        >
          <Tooltip title={data.body}>
            <Typography noWrap fontSize={14}>
              {data.body}
            </Typography>
          </Tooltip>
          <Button
            variant="outlined"
            sx={{
              fontSize: 12,
            }}
            size="small"
            onClick={() => handleClick(data)}
          // href={`/details/${data._id}`}
          >
            Details
          </Button>
        </Box>
        <Divider
          sx={{
            my: 1,
          }}
        />
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
              <Typography variant="h6">{data.impression}</Typography>
              <Typography variant="body2" color={"gray"}>
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
              <Typography variant="h6">{data.heat}</Typography>
              <Typography variant="body2" color={"gray"}>
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
              <Typography variant="h6">{data.days_count}</Typography>
              <Typography variant="body2" color={"gray"}>
                Days
              </Typography>
            </Grid>
          </Grid>
        </Box>
      </CardContent>
    </Card>
  );
}
