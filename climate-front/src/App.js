import React, { useState, useEffect } from "react";
import axios from "axios";

import Articles from "./Components/Articles";
import Map from "./Components/Map";
import Navbar from "./Components/Navbar";
import Loading from "./Components/Loading";
import LoadingCards from "./Components/LoadingCards";
import NoArticle from "./Components/NoArticle";
import CountryModal from "./Components/CountryModal";
import CountryHover from "./Components/CountryHover";

import { countryList } from "./countryList";

import "./App.css";

const App = () => {
	const [articles, setArticles] = useState([]);
	const [selectedCountry, setSelectedCountry] = useState({
		ISOcode: "",
		country: "",
		image: "",
		three_digit_ISO_country_code: "",
	});
	const [statusCode, setStatusCode] = useState("");
	const [hover, setHover] = useState("");
	const [stats, setStats] = useState([]);
	const [countryStats, setCountryStats] = useState([]);

	// const handleHover = (geo, e) => {
	// 	if (geo.id) {
	// 		const foundCountry = countryList.filter(
	// 			(x) => x.three_digit_ISO_country_code === geo.id.toString()
	// 		)[0];

	// 		setHover(foundCountry.country);
	// 	} else {
	// 		setHover("");
	// 	}
	// 	// console.log("HOVER COUNTRY: ", hover);
	// };

	// Same as clickCountry but for searching instead of clicking map
	const searchCountry = (countryInput) => {
		console.log("SELECTED COUNTRY: ", countryInput);
		getNewsData(countryInput);
		getCountryStats(countryInput);
	};

	const getCountryStats = async (country) => {
		const STATS_URI = `https://gcn-api-dev.herokuapp.com:443/climate-data/${country}`;
		const res = await axios.get(STATS_URI);
		const data = res.data;
		setCountryStats(data);
	};

	const getNewsData = async (country) => {
		setArticles([]);
		setStatusCode("");
		const ARTICLES_URI = `https://gcn-api-dev.herokuapp.com:443/articles/${country}`;
		const res = await axios.get(ARTICLES_URI);
		if (res.status === 200) setStatusCode("200");
		const data = res.data;
		setArticles(data);
	};

	// Find country by clicking on map
	const clickCountry = (geo, e) => {
		const foundCountry = countryList.filter(
			(x) => x.three_digit_ISO_country_code === geo.id.toString()
		)[0];
		console.log("selectedCountry: ", foundCountry);
		setSelectedCountry(foundCountry);
		getNewsData(foundCountry.country);
		getCountryStats(foundCountry.country);
	};

	return (
		<div className="App">
			<Navbar
				countries={countryList}
				searchCountry={searchCountry}
				selectedCountry={selectedCountry}
				setSelectedCountry={setSelectedCountry}
			/>

			<div className="app-container">
				{/* CountryHover not showing for some reason */}
				{/* <CountryHover hover={hover} /> */}

				{selectedCountry.country ? (
					<CountryModal country={selectedCountry} stats={countryStats} />
				) : null}

				<Map
					// handleHover={handleHover}
					clickCountry={clickCountry}
					selectedCountry={selectedCountry}
				/>
				{selectedCountry.country ? (
					<div className="news-container">
						{statusCode === "200" ? (
							articles.length > 0 ? (
								<Articles articles={articles} />
							) : (
								<NoArticle country={selectedCountry} />
							)
						) : (
							<LoadingCards />
						)}
					</div>
				) : null}
			</div>
		</div>
	);
};

export default App;
