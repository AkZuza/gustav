import { Html } from "@elysiajs/html";

const Textbox = () => {
	return (
		<div class="fixed bottom-0 h-24">
			<form class="w-screen h-24 bg-[#090912] flex-row flex justify-center" hx-post="/prompt" hx-swap="none">
				
				<div class="w-[85%] p-2 content-center">
					<input type="text" class="w-[100%] h-12 p-2 px-4 bg-gray-800 rounded-[100px]" name="prompt" id="name"></input>
				</div>

				<div class="w-[15%] h-[100%] content-center">
					<button type="submit" value="Send" method="post" class="bg-white object-center h-12 w-12"></button>
				</div>

			</form>
		</div>
	)
}

export default Textbox
