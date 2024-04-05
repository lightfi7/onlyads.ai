import {
  Autocomplete,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Checkbox,
  Divider,
  Grid,
  InputAdornment,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import React from "react";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";

import { setParams } from "../../redux/sales/topStoreSlice";
import dayjs from "dayjs";

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

const json = {
  store_language: [
    {
      id: "0ad8d381-7217-4df1-be9e-bbb3a7c3a40c",
      value: "Afrikaans",
      code: "af",
    },
    {
      id: "72369402-bbdc-4ff5-be4c-a3e6278e06c7",
      value: "Albanian",
      code: "sq",
    },
    {
      id: "8fd41afc-3ecd-479e-ab28-be1b6825ca04",
      value: "Arabic",
      code: "ar",
    },
    {
      id: "eeacc1f2-0ec9-4fb0-a8ef-602fea6c5d10",
      value: "Armenian",
      code: "hy",
    },
    {
      id: "ea76c8ec-8a92-4593-a436-454e67dcf8d0",
      value: "Azerbaijani",
      code: "az",
    },
    {
      id: "24b4c841-1d1b-4598-b9fc-2e7a0aa96e40",
      value: "Basque",
      code: "eu",
    },
    {
      id: "2de69e66-c77c-4fc2-ae1f-dad272d353f1",
      value: "Bengali (Bangla)",
      code: "bn",
    },
    {
      id: "d29f62bf-1e53-49fe-919e-b49fcd2d8a46",
      value: "Bulgarian",
      code: "bg",
    },
    {
      id: "ebd65485-5204-498f-b20f-2c505aed904c",
      value: "Cambodian",
      code: "km",
    },
    {
      id: "7f7e8cc9-b653-4c49-bcd2-4c43f2958d9a",
      value: "Catalan",
      code: "ca",
    },
    {
      id: "236cbf56-b274-4367-bf0e-4720adfbba00",
      value: "Chinese (Simplified)",
      code: "zh",
    },
    {
      id: "fc04f87f-8594-46bd-aac4-cf6f7258ab12",
      value: "Croatian",
      code: "hr",
    },
    {
      id: "f0e348ef-87a5-4c5c-89a2-30a7180204d8",
      value: "Czech",
      code: "cs",
    },
    {
      id: "3dd5acdf-e8b4-4d01-8a1f-426fa56e9fae",
      value: "Danish",
      code: "da",
    },
    {
      id: "4f87ea54-bb78-4836-a146-f93f640c5d66",
      value: "Dutch",
      code: "nl",
    },
    {
      id: "6df13bf0-3be5-4756-beed-9476391ffeda",
      value: "English",
      code: "en",
    },
    {
      id: "52e814c5-2576-40d5-bc61-f906faf55265",
      value: "Esperanto",
      code: "eo",
    },
    {
      id: "ddc7a9bc-c7a3-4db6-ab16-0ea1c202449f",
      value: "Estonian",
      code: "et",
    },
    {
      id: "fd41934c-ae72-48e5-9624-0969910087dd",
      value: "Faeroese",
      code: "fo",
    },
    {
      id: "4a3c04d7-81bc-480b-9027-8a911e3cb1c2",
      value: "Farsi",
      code: "fa",
    },
    {
      id: "80e88c02-2410-4f6d-98cf-525b2dec11b0",
      value: "Finnish",
      code: "fi",
    },
    {
      id: "aad06e3b-2394-4e51-882c-5cac79122006",
      value: "French",
      code: "fr",
    },
    {
      id: "96cdf1cd-2fe7-465b-8866-167074b2b63a",
      value: "Galician",
      code: "gl",
    },
    {
      id: "4145917e-223d-4164-9359-f86c9be774d7",
      value: "Georgian",
      code: "ka",
    },
    {
      id: "01972fbb-bf6f-4c91-aab2-e89ad1d872eb",
      value: "German",
      code: "de",
    },
    {
      id: "f1b673ea-8de3-4052-b44f-8d70d765bbef",
      value: "Greek",
      code: "el",
    },
    {
      id: "92e84eb1-bf9e-4268-af6f-37c1eaab6add",
      value: "Hebrew",
      code: "he",
    },
    {
      id: "28536b0b-94ac-40a1-8012-3e8528e16d92",
      value: "Hindi",
      code: "hi",
    },
    {
      id: "7bcdc063-0712-479c-988f-ed20688ee4ce",
      value: "Hungarian",
      code: "hu",
    },
    {
      id: "bd244609-3497-4548-ab9d-f297f4dcbd79",
      value: "Icelandic",
      code: "is",
    },
    {
      id: "e4045f1a-63cf-4799-91a9-5d6a1e5d3e31",
      value: "Indonesian",
      code: "id",
    },
    {
      id: "68e509b3-1050-4cef-92b8-44df126bb92a",
      value: "Interlingua",
      code: "ia",
    },
    {
      id: "cbbb2216-da09-49fc-821f-76d5eef2d586",
      value: "Irish",
      code: "ga",
    },
    {
      id: "f4da2eaa-7612-440b-8cd1-7c0892ac3fd8",
      value: "Italian",
      code: "it",
    },
    {
      id: "7b6eff03-9dae-4c0f-97cc-57a6d433d442",
      value: "Japanese",
      code: "ja",
    },
    {
      id: "b791b8b9-1de6-4a22-9c5c-9d8656f6e83e",
      value: "Kannada",
      code: "kn",
    },
    {
      id: "0849a831-a971-468d-a2a7-625b594a2c59",
      value: "Kazakh",
      code: "kk",
    },
    {
      id: "2754654d-43ff-41f8-9084-d27026a29034",
      value: "Kirghiz",
      code: "ky",
    },
    {
      id: "cba39faf-cf73-408a-9b5d-2387f04d0785",
      value: "Korean",
      code: "ko",
    },
    {
      id: "27b27be5-da5c-4701-9ffd-9b5fc316705d",
      value: "Kurdish",
      code: "ku",
    },
    {
      id: "d719c685-e07d-4c03-af72-4302f6fcb6fe",
      value: "Laothian",
      code: "lo",
    },
    {
      id: "3ff966ff-4d5e-4d00-8d4f-77cd1c886bc5",
      value: "Latvian (Lettish)",
      code: "lv",
    },
    {
      id: "56c973a4-dd31-4846-b03a-fe8cd5eda379",
      value: "Lithuanian",
      code: "lt",
    },
    {
      id: "ebf35df6-31e2-4402-9a0c-52c7bb7a7e17",
      value: "Macedonian",
      code: "mk",
    },
    {
      id: "7c87c1d9-2ee1-4c6c-acdc-f3bfd4de1da1",
      value: "Malay",
      code: "ms",
    },
    {
      id: "409e7b39-b682-4b1d-9413-4b981d7944a9",
      value: "Malayalam",
      code: "ml",
    },
    {
      id: "571a15b0-5fde-4a97-b4b9-7497e0ef45f1",
      value: "Maltese",
      code: "mt",
    },
    {
      id: "4d212353-2bda-4984-b6d8-c2a88e49a817",
      value: "Moldavian",
      code: "mo",
    },
    {
      id: "c35f3af2-8e76-4110-bf7f-df2795270b05",
      value: "Mongolian",
      code: "mn",
    },
    {
      id: "0e214a4a-c905-4d6a-aaae-10e19faa04c2",
      value: "Nepali",
      code: "ne",
    },
    {
      id: "553c34d8-b127-4a32-9e46-70324c25bdd6",
      value: "Norwegian",
      code: "no",
    },
    {
      id: "93f3079e-270f-4372-85d1-17e584cdb48c",
      value: "Polish",
      code: "pl",
    },
    {
      id: "9b791057-2243-4c96-8179-a8abcd876e8c",
      value: "Portuguese",
      code: "pt",
    },
    {
      id: "22ef865e-60cd-490a-ba94-61eae7a1b6e3",
      value: "Romanian",
      code: "ro",
    },
    {
      id: "877d7283-221d-4ebc-9da5-d8c678c1bcab",
      value: "Russian",
      code: "ru",
    },
    {
      id: "79c41579-7239-49b2-98e9-a8e4029eb04c",
      value: "Serbian",
      code: "sr",
    },
    {
      id: "207238cd-a20b-4a84-ab33-6d82cfbc8e58",
      value: "Serbo-Croatian",
      code: "sh",
    },
    {
      id: "6f0539ab-e185-4c8e-947b-c7a091b59935",
      value: "Slovak",
      code: "sk",
    },
    {
      id: "d2491181-3297-4818-9e6f-c3d4b5794fd3",
      value: "Slovenian",
      code: "sl",
    },
    {
      id: "f7b7cbee-8f05-4670-bba7-fcff9fc955c3",
      value: "Spanish",
      code: "es",
    },
    {
      id: "4301b3a0-a67d-45e0-9e1b-2fd793379ad2",
      value: "Swahili (Kiswahili)",
      code: "sw",
    },
    {
      id: "1974baf0-6e3b-43b3-b39d-184a562147ef",
      value: "Swedish",
      code: "sv",
    },
    {
      id: "4c17786e-7c4b-4105-a576-93fbf65ddc3d",
      value: "Tajik",
      code: "tg",
    },
    {
      id: "4e20b392-669c-470f-bd91-f739c47585f2",
      value: "Tamil",
      code: "ta",
    },
    {
      id: "f2b83b24-7120-4747-a3b0-021e38366da9",
      value: "Thai",
      code: "th",
    },
    {
      id: "183390a2-7e8c-4e3a-abf0-ec517deb6e89",
      value: "Turkish",
      code: "tr",
    },
    {
      id: "cef84c07-9d7a-419e-b0c8-44e4a4509082",
      value: "Twi",
      code: "tw",
    },
    {
      id: "07b4fe51-26a7-4c24-9db7-954faededdc5",
      value: "Ukrainian",
      code: "uk",
    },
    {
      id: "dd2ec701-e5cd-48b0-84eb-28851428e342",
      value: "Urdu",
      code: "ur",
    },
    {
      id: "acf4a86b-5bd8-4444-ab73-201406f87a91",
      value: "Uzbek",
      code: "uz",
    },
    {
      id: "6de07722-ddd2-44c8-86e4-3a8fdf3c78f3",
      value: "Vietnamese",
      code: "vi",
    },
    {
      id: "2f52e949-e87f-4304-b513-251e9bc6c7fc",
      value: "Welsh",
      code: "cy",
    },
    {
      id: "6ab5a909-c6f6-4125-91ed-bbe64060bece",
      value: "Yiddish",
      code: "yi",
    },
    {
      id: "ba42368c-e42d-4bea-94b9-c84f5ddc6cc8",
      value: "Zulu",
      code: "zu",
    },
  ],
};

export default function SearchBar({ disabled }) {
  const dispatch = useDispatch();
  const data = useSelector((state) => state.topstores);
  const [params, setParams_] = React.useState({ ...data.params.filters });

  useEffect(() => {
    setParams_(data.params.filters);
  }, [data.params.filters]);

  return (
    <Card
      sx={{
        boxShadow: "0 0 16px rgba(0, 0, 0, 0.16)",
      }}
    >
      <CardHeader title={"Search For Top Stores"} />
      <CardContent>
        <Stack direction={"row"} spacing={2} divider={<Divider />}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 2,
              p: 2,
              width: "100%",
            }}
          >
            {/* <Box sx={{ width: "100%" }}>
                <Typography variant="h5">Filters</Typography>
              </Box> */}
            <Box
              sx={{
                width: "100%",
              }}
            >
              <Typography variant="h6" fontSize={18}>
                Title
              </Typography>
              <TextField
                fullWidth
                value={params.q}
                placeholder="Search for a store..."
                onChange={(e) => setParams_({ ...params, q: e.target.value })}
              />
            </Box>
            <Grid container spacing={4}>
              <Grid item xs={12} sm={6}>
                <Box
                  sx={{
                    width: "100%",
                  }}
                >
                  <Typography variant="h6" fontSize={18}>
                    Revenue
                  </Typography>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      gap: 2,
                    }}
                  >
                    <TextField
                      disabled={disabled}
                      variant="outlined"
                      sx={{
                        flex: 1,
                      }}
                      type="number"
                      placeholder="Monthly Revenue"
                      value={
                        params.revenue.min == null ? "" : params.revenue.min
                      }
                      onChange={(e) => {
                        setParams_({
                          ...params,
                          revenue: {
                            min: e.target.value,
                            max: params.revenue.max,
                          },
                        });
                      }}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Typography>Min</Typography>
                          </InputAdornment>
                        ),
                      }}
                    />
                    <ArrowForwardIosIcon color="disabled" fontSize="small" />
                    <TextField
                      disabled={disabled}
                      variant="outlined"
                      sx={{
                        flex: 1,
                      }}
                      type="number"
                      placeholder="Monthly Revenue"
                      value={
                        params.revenue.max == null ? "" : params.revenue.max
                      }
                      onChange={(e) => {
                        setParams_({
                          ...params,
                          revenue: {
                            max: e.target.value,
                            min: params.revenue.min,
                          },
                        });
                      }}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Typography>Max</Typography>
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Box>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Box
                  sx={{
                    width: "100%",
                  }}
                >
                  <Typography variant="h6" fontSize={18}>
                    Sales
                  </Typography>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      gap: 2,
                    }}
                  >
                    <TextField
                      disabled={disabled}
                      variant="outlined"
                      sx={{
                        flex: 1,
                      }}
                      type="number"
                      placeholder="Monthly Sales"
                      value={params.sales?.min == null ? "" : params.sales?.min}
                      onChange={(e) => {
                        setParams_({
                          ...params,
                          sales: {
                            min: e.target.value,
                            max: params.sales?.max,
                          },
                        });
                      }}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Typography>Min</Typography>
                          </InputAdornment>
                        ),
                      }}
                    />
                    <ArrowForwardIosIcon color="disabled" fontSize="small" />
                    <TextField
                      disabled={disabled}
                      variant="outlined"
                      sx={{
                        flex: 1,
                      }}
                      type="number"
                      placeholder="Monthly Sales"
                      value={params.sales?.max == null ? "" : params.sales?.max}
                      onChange={(e) => {
                        setParams_({
                          ...params,
                          sales: {
                            max: e.target.value,
                            min: params.sales?.min,
                          },
                        });
                      }}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Typography>Max</Typography>
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Box>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Box
                  sx={{
                    width: "100%",
                  }}
                >
                  <Typography variant="h6" fontSize={18}>
                    Products
                  </Typography>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      gap: 2,
                    }}
                  >
                    <TextField
                      disabled={disabled}
                      variant="outlined"
                      sx={{
                        flex: 1,
                      }}
                      type="number"
                      placeholder="Products"
                      value={
                        params.products.min == null ? "" : params.products.min
                      }
                      onChange={(e) => {
                        setParams_({
                          ...params,
                          products: {
                            min: e.target.value,
                            max: params.products.max,
                          },
                        });
                      }}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Typography>Min</Typography>
                          </InputAdornment>
                        ),
                      }}
                    />
                    <ArrowForwardIosIcon color="disabled" fontSize="small" />
                    <TextField
                      disabled={disabled}
                      variant="outlined"
                      sx={{
                        flex: 1,
                      }}
                      type="number"
                      placeholder="Store Products"
                      value={
                        params.products.max == null ? "" : params.products.max
                      }
                      onChange={(e) => {
                        setParams_({
                          ...params,
                          products: {
                            max: e.target.value,
                            min: params.products.min,
                          },
                        });
                      }}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Typography>Max</Typography>
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Box>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Box
                  sx={{
                    width: "100%",
                  }}
                >
                  <Typography variant="h6" fontSize={18}>
                    Languages
                  </Typography>
                  <Autocomplete
                    disabled={disabled}
                    multiple
                    sx={{
                      width: "100%",
                    }}
                    options={json.store_language}
                    disableCloseOnSelect
                    getOptionLabel={(option) => option.code}
                    renderOption={(props, option, { selected }) => (
                      <li {...props}>
                        <Checkbox
                          icon={icon}
                          checkedIcon={checkedIcon}
                          style={{ marginRight: 8 }}
                          checked={selected}
                        />
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                          }}
                        >
                          <Box>
                            <Typography
                              variant="subtitle2"
                              sx={{
                                lineHeight: 1.2,
                              }}
                            >
                              {option.code}
                            </Typography>
                            <Typography
                              variant="body2"
                              sx={{
                                lineHeight: 1.2,
                              }}
                            >
                              {option.value}
                            </Typography>
                          </Box>
                        </Box>
                      </li>
                    )}
                    renderInput={(params) => (
                      <TextField
                        disabled={disabled}
                        {...params}
                        placeholder="Languages"
                      />
                    )}
                    onChange={(e, value) => {
                      setParams_({
                        ...params,
                        languages: value,
                      });
                    }}
                    value={params.languages || []}
                  />
                </Box>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Box
                  sx={{
                    width: "100%",
                  }}
                >
                  <Typography variant="h6" fontSize={18}>
                    Creation Date
                  </Typography>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 2,
                      }}
                    >
                      <DatePicker
                        disabled={disabled}
                        value={dayjs(
                          params.created_at.min
                            ? params.created_at.min
                            : new Date(
                                new Date().setFullYear(
                                  new Date().getFullYear() - 100
                                )
                              ).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "2-digit",
                                day: "2-digit",
                              })
                        )}
                        onChange={(value) => {
                          setParams_({
                            ...params,
                            created_at: {
                              min: dayjs(value).format("MM/DD/YYYY"),
                              max: params.created_at.max,
                            },
                          });
                        }}
                        sx={{
                          flex: 1,
                        }}
                      />
                      <ArrowForwardIosIcon color="disabled" fontSize="small" />
                      <DatePicker
                        disabled={disabled}
                        value={dayjs(
                          params.created_at.max
                            ? params.created_at.max
                            : new Date().toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "2-digit",
                                day: "2-digit",
                              })
                        )}
                        onChange={(value) => {
                          setParams_({
                            ...params,
                            created_at: {
                              min: params.created_at.min,
                              max: dayjs(value).format("MM/DD/YYYY"),
                            },
                          });
                        }}
                        sx={{
                          flex: 1,
                        }}
                      />
                    </Box>
                  </LocalizationProvider>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </Stack>

        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            gap: 4,
            p: 2,
          }}
        >
          <Button
            disabled={disabled}
            variant="outlined"
            size="large"
            color="primary"
            sx={{
              maxWidth: 500,
              minWidth: 300,
            }}
            onClick={() => {
              dispatch(
                setParams({
                  ...data.params,
                  filters: {
                    title: null,
                    price: { max: null, min: null },
                    sales: { max: null, min: null },
                    revenue: { max: null, min: null },
                    products: { max: null, min: null },
                    created_at: {
                      min: null, //new Date(new Date().setFullYear(new Date().getFullYear() - 100)).toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit'}),
                      max: null, //new Date().toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit'}),
                    },
                    languages: [],
                  },
                  page: 0,
                })
              );
            }}
          >
            Reset Filters
          </Button>
          <Button
            disabled={disabled}
            variant="contained"
            size="large"
            color="primary"
            sx={{
              maxWidth: 500,
              minWidth: 300,
            }}
            onClick={() => {
              dispatch(setParams({ ...data.params, filters: params, page: 0 }));
            }}
          >
            Search
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
}
