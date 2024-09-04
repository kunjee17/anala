import { Button } from "react-daisyui";

export const Logout = () => {
	return (
		<Button
			tag={"a"}
			color={"warning"}
			onClick={async () => {
				const res = await fetch("/api/auth/logout", {
					method: "GET",
				});
				if (!res.ok) {
					return await res.json();
				}

				if (res.redirected) {
					window.location.assign(res.url);
				}
				//Some toast message may be?
			}}
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="1em"
				height="1em"
				viewBox="0 0 24 24"
			>
				<title>Logout</title>
				<path
					fill="currentColor"
					d="M5.616 20q-.691 0-1.153-.462T4 18.384V5.616q0-.691.463-1.153T5.616 4h6.403v1H5.616q-.231 0-.424.192T5 5.616v12.769q0 .23.192.423t.423.192h6.404v1zm10.846-4.461l-.702-.72l2.319-2.319H9.192v-1h8.887l-2.32-2.32l.702-.718L20 12z"
				/>
			</svg>
		</Button>
	);
};
