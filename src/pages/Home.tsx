import { Html } from "@elysiajs/html";
import Base from "../layouts/Base";
import Header from "../components/Header";

const Home = ( { children }: { children?: any }) => {
	return (
		<Base>
			<body class="bg-[#090912] text-[#d1d1d1] h-screen">
				<div hx-get="/component/chat" hx-swap="innerHTML" hx-trigger="load" class="object-fill" ></div>
				<div hx-get="/component/textbox" hx-swap="innerHTML" hx-trigger="load"></div>
			</body>
		</Base>
	)	
}

export default Home
