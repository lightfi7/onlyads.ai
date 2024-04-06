import {
  Autocomplete,
  Box,
  Button,
  Card,
  CardContent,
  Container,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import SearchIcon from "@mui/icons-material/Search";
import CustomRangeSelect from "../../components/CustomRangeSelect";
import { DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { setParams } from "../../redux/dashboard/dataSlice";
import { useDispatch } from "react-redux";
import dayjs from "dayjs";

var countries = [
  {
    name: "reMen",
    label: "Most Popular",
    zh: "热门",
    isHot: !0,
    options: [
      {
        label: "United States",
        zh: "美国",
        value: "USA",
      },
      {
        label: "Taiwan",
        zh: "中国台湾",
        value: "TWN",
      },
      {
        label: "Japan",
        zh: "日本",
        value: "JPN",
      },
      {
        label: "Korea",
        zh: "韩国",
        value: "KOR",
      },
      {
        label: "Indonesia",
        zh: "印度尼西亚",
        value: "IDN",
      },
      {
        label: "Philippines",
        zh: "菲律宾",
        value: "PHL",
      },
      {
        label: "Thailand",
        zh: "泰国",
        value: "THA",
      },
      {
        label: "Brazil",
        zh: "巴西",
        value: "BRA",
      },
      {
        label: "Vietnam",
        zh: "越南",
        value: "VNM",
      },
      {
        label: "Spain",
        zh: "西班牙",
        value: "ESP",
      },
      {
        label: "Mexico",
        zh: "墨西哥",
        value: "MEX",
      },
      {
        label: "India",
        zh: "印度",
        value: "IND",
      },
    ],
  },
  {
    name: "KMT",
    label: "HK/MO/TW",
    zh: "港澳台",
    options: [
      {
        label: "Macau",
        zh: "中国澳门",
        value: "MAC",
      },
      {
        label: "Taiwan",
        zh: "中国台湾",
        value: "TWN",
      },
      {
        label: "Hong Kong",
        zh: "中国香港",
        value: "HKG",
      },
    ],
  },
  {
    name: "JK",
    label: "Japan Korea",
    zh: "日韩",
    options: [
      {
        label: "Japan",
        zh: "日本",
        value: "JPN",
      },
      {
        label: "Korea",
        zh: "韩国",
        value: "KOR",
      },
    ],
  },
  {
    name: "ESA",
    label: "Southeast Asia",
    zh: "东南亚",
    options: [
      {
        label: "Thailand",
        zh: "泰国",
        value: "THA",
      },
      {
        label: "Indonesia",
        zh: "印度尼西亚",
        value: "IDN",
      },
      {
        label: "Singapore",
        zh: "新加坡",
        value: "SGP",
      },
      {
        label: "Malaysia",
        zh: "马来西亚",
        value: "MYS",
      },
      {
        label: "Vietnam",
        zh: "越南",
        value: "VNM",
      },
      {
        label: "Philippines",
        zh: "菲律宾",
        value: "PHL",
      },
      {
        label: "Cambodia",
        zh: "柬埔寨",
        value: "KHM",
      },
    ],
  },
  {
    name: "SA",
    label: "Southern Asia",
    zh: "南亚",
    options: [
      {
        label: "India",
        zh: "印度",
        value: "IND",
      },
      {
        label: "Pakistan",
        zh: "巴基斯坦",
        value: "PAK",
      },
    ],
  },
  {
    name: "ME",
    label: "Middle East",
    zh: "中东",
    options: [
      {
        label: "Bahrian",
        zh: "巴林",
        value: "BHR",
      },
      {
        label: "Qatar",
        zh: "卡塔尔",
        value: "QAT",
      },
      {
        label: "Saudi Arabia",
        zh: "沙特阿拉伯",
        value: "SAU",
      },
      {
        label: "United Arab Emirates",
        zh: "阿联酋",
        value: "ARE",
      },
      {
        label: "Azerbaijan",
        zh: "阿塞拜疆",
        value: "AZE",
      },
      {
        label: "Lebanon",
        zh: "黎巴嫩",
        value: "LBN",
      },
      {
        label: "Kuwait",
        zh: "科威特",
        value: "KWT",
      },
      {
        label: "Israel",
        zh: "以色列",
        value: "ISR",
      },
      {
        label: "Oman",
        zh: "阿曼",
        value: "OMN",
      },
      {
        label: "Iraq",
        zh: "伊拉克",
        value: "IRQ",
      },
      {
        label: "Morocco",
        zh: "摩洛哥",
        value: "MAR",
      },
    ],
  },
  {
    name: "RSW",
    label: "CIS",
    zh: "独联体国家",
    options: [
      {
        label: "Russia",
        zh: "俄罗斯联邦",
        value: "RUS",
      },
      {
        label: "Ukraine",
        zh: "乌克兰",
        value: "UKR",
      },
    ],
  },
  {
    name: "SAC",
    label: "South America",
    zh: "南美",
    options: [
      {
        label: "Brazil",
        zh: "巴西",
        value: "BRA",
      },
      {
        label: "Chile",
        zh: "智利",
        value: "CHL",
      },
      {
        label: "Arglabeltina",
        zh: "阿根廷",
        value: "ARG",
      },
      {
        label: "Colombia",
        zh: "哥伦比亚",
        value: "COL",
      },
      {
        label: "Peru",
        zh: "秘鲁",
        value: "PER",
      },
      {
        label: "Vlabelezuela",
        zh: "委内瑞拉",
        value: "Vlabel",
      },
      {
        label: "Paraguay",
        zh: "巴拉圭",
        value: "PRY",
      },
    ],
  },
  {
    name: "NA",
    label: "North America",
    zh: "北美",
    options: [
      {
        label: "United States",
        zh: "美国",
        value: "USA",
      },
      {
        label: "Canada",
        zh: "加拿大",
        value: "CAN",
      },
      {
        label: "Mexico",
        zh: "墨西哥",
        value: "MEX",
      },
      {
        label: "Panama",
        zh: "巴拿马",
        value: "PAN",
      },
    ],
  },
  {
    name: "EP",
    label: "Europe",
    zh: "欧洲",
    options: [
      {
        label: "Türkiye",
        zh: "土耳其",
        value: "TUR",
      },
      {
        label: "France",
        zh: "法国",
        value: "FRA",
      },
      {
        label: "Germany",
        zh: "德国",
        value: "DEU",
      },
      {
        label: "United Kingdom",
        zh: "英国",
        value: "labelG",
      },
      {
        label: "Italy",
        zh: "意大利",
        value: "ITA",
      },
      {
        label: "Spain",
        zh: "西班牙",
        value: "ESP",
      },
      {
        label: "Netherlands",
        zh: "荷兰",
        value: "NLD",
      },
      {
        label: "Norway",
        zh: "挪威",
        value: "NOR",
      },
      {
        label: "Poland",
        zh: "波兰",
        value: "POL",
      },
      {
        label: "Portugal",
        zh: "葡萄牙",
        value: "PRT",
      },
      {
        label: "Belgium",
        zh: "比利时",
        value: "BEL",
      },
      {
        label: "Switzerland",
        zh: "瑞士",
        value: "CHE",
      },
      {
        label: "Austria",
        zh: "奥地利",
        value: "AUT",
      },
      {
        label: "Romania",
        zh: "罗马尼亚",
        value: "ROM",
      },
      {
        label: "Swedlabel",
        zh: "瑞典",
        value: "SWE",
      },
      {
        label: "Greece",
        zh: "希腊",
        value: "GRC",
      },
      {
        label: "Dlabelmark",
        zh: "丹麦",
        value: "DNK",
      },
      {
        label: "Luxembourg",
        zh: "卢森堡",
        value: "LUX",
      },
      {
        label: "Ireland",
        zh: "爱尔兰",
        value: "IRL",
      },
      {
        label: "Finland",
        zh: "芬兰",
        value: "FIN",
      },
    ],
  },
  {
    name: "OC",
    label: "Oceania",
    zh: "大洋洲",
    options: [
      {
        label: "Australia",
        zh: "澳大利亚",
        value: "AUS",
      },
      {
        label: "New Zealand",
        zh: "新西兰",
        value: "NZL",
      },
    ],
  },
  {
    name: "AF",
    label: "Africa",
    zh: "非洲",
    options: [
      {
        label: "Egypt",
        zh: "埃及",
        value: "EGY",
      },
      {
        label: "Klabelya",
        zh: "肯尼亚",
        value: "Klabel",
      },
      {
        label: "Nigeria",
        zh: "尼日利亚",
        value: "NGA",
      },
      {
        label: "Angola",
        zh: "安哥拉",
        value: "AGO",
      },
      {
        label: "South Africa",
        zh: "南非",
        value: "ZAF",
      },
      {
        label: "Algeria",
        zh: "阿尔及利亚",
        value: "DZA",
      },
      {
        label: "Libya",
        zh: "利比亚",
        value: "LBY",
      },
      {
        label: "senegal",
        zh: "塞内加尔",
        value: "SEN",
      },
      {
        label: "Cote d'lvoire",
        zh: "科特迪瓦",
        value: "CIV",
      },
    ],
  },
];

const getCountryOptions = () => {
  const options = [];
  countries.forEach((country) => {
    country.options.map((o) => {
      options.push({
        glabel: country.label,
        ...o,
      });
    });
  });
  return options;
};

var countries_ = getCountryOptions();

var languages = [
  { label: "Chinese (Simplified)", value: "Chinese (Simplified)" },
  { label: "English", value: "English" },
  { label: "Japanese", value: "Japanese" },
  { label: "Korean", value: "Korean" },
  { label: "Arabic", value: "Arabic" },
  { label: "Chinese (Traditional)", value: "Chinese (Traditional)" },
  { label: "Thai", value: "Thai" },
  { label: "German", value: "German" },
  { label: "Spanish", value: "Spanish" },
  { label: "French", value: "French" },
  { label: "Hindi", value: "Hindi" },
  { label: "Italian", value: "Italian" },
  { label: "Malay", value: "Malay" },
  { label: "Dutch", value: "Dutch" },
  { label: "Portuguese", value: "Portuguese" },
  { label: "Russian", value: "Russian" },
  { label: "Vietnamese", value: "Vietnamese" },
  { label: "Indonesian", value: "Italian" },
  { label: "Hebrew", value: "Malay" },
  { label: "Filipino", value: "Dutch" },
  { label: "Norwegian", value: "Portuguese" },
  { label: "Turkish", value: "Russian" },
  { label: "Polish", value: "Vietnamese" },
];

const ads_platforms = [
  {
    id: "youtube",
    title: "Youtube",
  },
  {
    id: "tiktok",
    title: "TikTok",
  },
  {
    id: "facebook",
    title: "Facebook",
  },
  {
    id: "instagram",
    title: "Instagram",
  },
  {
    id: "twitter",
    title: "Twitter",
  },
  {
    id: "pinterest",
    title: "Pinterest",
  },
  // {
  //   id: "admob",
  //   title: "Admob",
  // },
  {
    id: "yahoo",
    title: "Yahoo",
  },
  {
    id: "all",
    title: "All",
  },
];

export default function SearchBar({ data, userStatus }) {
  const { params } = data;
  const dispatch = useDispatch();
  const [searchText, setSearchText] = useState("");
  const [viewMore, setViewMore] = useState(true);

  const handleCountryChange = (e, values) => {
    if (!userStatus) return;
    dispatch(setParams({ ...data.params, countries: values }));
  };

  const handleLanguageChange = (e, values) => {
    if (!userStatus) return;
    dispatch(setParams({ ...data.params, languages: values }));
  };

  const handleFromChange = (date) => {
    if (!userStatus) return;
    dispatch(
      setParams({
        ...data.params,
        date: [dayjs(date).format("MM/DD/YYYY"), data.params.date[1]],
      })
    );
  };

  const handleToChange = (date) => {
    if (!userStatus) return;
    dispatch(
      setParams({
        ...data.params,
        date: [data.params.date[0], dayjs(date).format("MM/DD/YYYY")],
      })
    );
  };

  const handleChangeSearchType = (e) => {
    if (!userStatus) return;
    dispatch(setParams({ ...data.params, qt: e.target.value }));
  };

  const handleChangeSearchText = (e) => {
    if (!userStatus) return;
    setSearchText(e.target.value);
    // dispatch(setParams({ ...data.params, q: e.target.value }));
  };

  const handleClickSearch = (e) => {
    if (!userStatus) return;
    dispatch(setParams({ ...data.params, q: searchText }));
  };

  const handleClickMore = (e) => {
    setViewMore(!viewMore);
  };

  const handleChangePlatform = (value) => {
    if (!userStatus) return;
    dispatch(setParams({ ...data.params, type: value, page: 1 }));
  };

  const handleChangeImpression = (value) => {
    if (!userStatus) return;
    dispatch(setParams({ ...data.params, impression: value }));
  };

  const handleChangeLikes = (value) => {
    if (!userStatus) return;
    dispatch(setParams({ ...data.params, likes: value }));
  };

  const handleChangePopularity = (value) => {
    if (!userStatus) return;
    dispatch(setParams({ ...data.params, popularity: value }));
  };

  const handleChangeDays = (value) => {
    if (!userStatus) return;
    dispatch(setParams({ ...data.params, days: value }));
  };

  return (
    <Card
      variant="outlined"
      sx={{
        border: 0,
      }}
    >
      <CardContent
        sx={{
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Stack
          spacing={2}
          sx={{
            width: "100%",
            maxWidth: "lg",
          }}
        >
          <Box>
            <Container
              sx={{
                display: "flex",
                justifyContent: "center",
                flexDirection: {
                  xs: "column",
                  sm: "row",
                },
                gap: { xs: 2, sm: 0 },
                mb: 2,
              }}
            >
              <Select
                disabled={!userStatus}
                value={params.qt}
                onChange={handleChangeSearchType}
                sx={{
                  minWidth: 180,
                  borderTopRightRadius: 0,
                  borderBottomRightRadius: 0,
                }}
              >
                <MenuItem value={"keyword"}>Ad Keyword</MenuItem>
                <MenuItem value={"text"}>Ad Text</MenuItem>
                <MenuItem value={"advertiser"}>Advertiser Name</MenuItem>
                <MenuItem value={"link"}>Link</MenuItem>
              </Select>
              <TextField
                disabled={!userStatus}
                sx={{
                  flex: 1,
                }}
                InputProps={{
                  style: {
                    borderRadius: 0,
                  },
                }}
                variant="outlined"
                value={searchText}
                onChange={handleChangeSearchText}
                placeholder="Search ..."
              />
              <Button
                disabled={!userStatus}
                variant="contained"
                color="primary"
                sx={{
                  display: { xs: "none", sm: "flex" },
                  borderTopLeftRadius: 0,
                  borderBottomLeftRadius: 0,
                }}
                onClick={handleClickSearch}
              >
                <SearchIcon />
              </Button>
              <Button
                sx={{
                  ml: 1,
                }}
                onClick={handleClickMore}
              >
                {viewMore ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              </Button>
            </Container>
          </Box>
          {viewMore ? (
            <>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: {
                    xs: "column",
                    sm: "row",
                  },
                  gap: 4,
                }}
              >
                <Typography variant="title1" minWidth={120}>
                  Platform :
                </Typography>
                <Stack direction={{ xs: "column", sm: "row" }} spacing={1}>
                  {ads_platforms.map((p, k) => (
                    <Button
                      key={k}
                      disabled={!userStatus}
                      variant={p.id == params.type ? "contained" : "outlined"}
                      onClick={() => {
                        handleChangePlatform(p.id);
                      }}
                    >
                      {p.title}
                    </Button>
                  ))}
                </Stack>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: {
                    xs: "column",
                    sm: "row",
                  },
                  gap: 4,
                }}
              >
                <Typography variant="title1" minWidth={120}>
                  Basic :
                </Typography>
                <Stack direction={{ xs: "column", sm: "row" }} spacing={1}>
                  <Autocomplete
                    disabled={!userStatus}
                    multiple
                    size="small"
                    sx={{
                      minWidth: 200,
                      maxWidth: 450,
                    }}
                    options={countries_}
                    groupBy={(option) => option.glabel}
                    getOptionLabel={(option) => option.label}
                    value={params.countries}
                    filterSelectedOptions
                    onChange={handleCountryChange}
                    renderInput={(params) => (
                      <TextField {...params} label="" placeholder="Countries" />
                    )}
                  />
                  <Autocomplete
                    disabled={!userStatus}
                    multiple
                    size="small"
                    sx={{
                      minWidth: 200,
                      maxWidth: 450,
                    }}
                    options={languages}
                    getOptionLabel={(option) => option.label}
                    onChange={handleLanguageChange}
                    value={params.languages}
                    filterSelectedOptions
                    renderInput={(params) => (
                      <TextField {...params} label="" placeholder="Languages" />
                    )}
                  />
                </Stack>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: {
                    xs: "column",
                    sm: "row",
                  },
                  gap: 4,
                }}
              >
                <Typography variant="title1" minWidth={120}>
                  Data :
                </Typography>
                <Stack direction={{ xs: "column", sm: "row" }} spacing={1}>
                  <CustomRangeSelect
                    disabled={!userStatus}
                    value={params.impression}
                    min={0}
                    max={10000}
                    handleChange={handleChangeImpression}
                    placeHolder={"Impression"}
                  />
                  <CustomRangeSelect
                    disabled={!userStatus}
                    value={params.likes}
                    min={0}
                    max={10000}
                    handleChange={handleChangeLikes}
                    placeHolder={"Likes"}
                  />
                  <CustomRangeSelect
                    disabled={!userStatus}
                    value={params.popularity}
                    min={0}
                    max={10000}
                    handleChange={handleChangePopularity}
                    placeHolder={"Popularity"}
                  />
                  <CustomRangeSelect
                    disabled={!userStatus}
                    value={params.days}
                    min={0}
                    max={10000}
                    handleChange={handleChangeDays}
                    placeHolder={"Days"}
                  />
                </Stack>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: {
                    xs: "column",
                    sm: "row",
                  },
                  gap: 4,
                }}
              >
                <Typography variant="title1" minWidth={120}>
                  Period :
                </Typography>
                <Stack direction={{ xs: "column", sm: "row" }} spacing={1}>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      disabled={!userStatus}
                      label="From"
                      slotProps={{ textField: { size: "small" } }}
                      value={dayjs(params.date[0])}
                      onChange={handleFromChange}
                    />
                    <DatePicker
                      disabled={!userStatus}
                      label="To"
                      slotProps={{ textField: { size: "small" } }}
                      value={dayjs(params.date[1])}
                      onChange={handleToChange}
                    />
                  </LocalizationProvider>
                </Stack>
              </Box>
            </>
          ) : (
            <></>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
}
