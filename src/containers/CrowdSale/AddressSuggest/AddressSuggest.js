import React from "react";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import LocationOnIcon from "@material-ui/icons/LocationOn";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import throttle from "lodash/throttle";
import axios from 'axios';


const getPlaces = (input, callback) => {
  fetch("https://autocomplete.geocoder.ls.hereapi.com/6.2/suggest.json?apikey=VvXjx14bJOpsdA5WMO_PTLd5Hgia1wYAlb5vO7Oa8kk&query="+input)
    .then(result => result.json())
    .then(data => {callback(data.suggestions)})
};

const useStyles = makeStyles(theme => ({
  icon: {
    color: theme.palette.text.secondary,
    marginRight: theme.spacing(2)
  }
}));

export default function AddressSuggest(props) {
  const classes = useStyles();
  const [inputValue, setInputValue] = React.useState("");
  const [options, setOptions] = React.useState([]);

  const handleChange = event => {
    setInputValue(event.target.value);
  };

  const fetch = React.useMemo(
    () =>
      throttle((inputValue, callback) => {
        getPlaces(inputValue,callback);
      }, 500),
    [],
  );

  React.useEffect(() => {
    let active = true;

    if (inputValue === "") {
      setOptions([]);
      return undefined;
    }
    fetch(inputValue , results => {
      if (active) {
        setOptions(results || []);
      }
    });

    return () => {
      active = false;
    };
  }, [inputValue, fetch]);

  return (
    <Autocomplete
      id="google-map-demo"
      getOptionLabel={option =>
        typeof option === "string" ? option : option.label
      }
      onChange={(event, value) => props.setFieldValue("locationSelectedId",value ? value.locationId : null)}
      filterOptions={x => x}
      options={options}
      autoComplete
      includeInputInList
      freeSolo
      disableOpenOnFocus
      renderInput={params => (
        <TextField
          {...params}
          label={props.placeholder}
          fullWidth
          onChange={handleChange}
        />
      )}
      renderOption={option => {
        // const matches =
        //   option.structured_formatting.main_text_matched_substrings;
        // const parts = parse(
        //   option.structured_formatting.main_text,
        //   matches.map(match => [match.offset, match.offset + match.length])
        // );
        return (
          <Grid container alignItems="center">
            <Grid item>
              <LocationOnIcon className={classes.icon} />
            </Grid>
            <Grid item xs>
              
                <span
                  key={option.locationId}
                  //style={{ fontWeight: part.highlight ? 700 : 400 }}
                >
                  {option.label}
                </span>
              

              <Typography variant="body2" color="textSecondary">
                {option.address.city},{option.address.county},{option.address.country}
              </Typography>
            </Grid>
          </Grid>
        );
      }}
    />
  );
}
