import { Html } from "@elysiajs/html";

const UserMessage = ( { message }: { message: string } ) => {
	return (
		<div class="justify-end w-100% my-1 flex">
			<div class="text-white w-[60%] bg-slate-800 py-1 px-2 rounded-lg">
				{message}
			</div>
		</div>
	)
}

export default UserMessage
