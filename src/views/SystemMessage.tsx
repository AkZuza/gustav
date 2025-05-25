import { Html } from "@elysiajs/html";

const SystemMessage = ( { id }: { id: number } ) => {
	return (
		<div class="justify-start w-100% px-4 py-2 my-1 flex">
			<div class="text-white w-[60%] bg-red-800 py-1 px-2 rounded-lg">
				<div hx-get={`/responses/${id}`} hx-trigger="load delay:1s" hx-swap="outerHTML" id={`response-${id}`} hx-target={`#response-${id}`}>
					Waiting for Response
				</div>
			</div>
		</div>
	)
}

export default SystemMessage
