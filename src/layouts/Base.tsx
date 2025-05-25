import { Html } from "@elysiajs/html";

const Base = ({ children }: { children?: any} ) => {
	return (
		<html>
			<head>
				<title> Gustav </title>
				<meta name="viewport" content="width=device-width, initial-scale=1.0"></meta>
			    <link href="css/style.css" rel="stylesheet"></link>
				<script src="scripts/htmx.min.js"></script>
			</head>

			{children}
		</html>
	)
}

export default Base
