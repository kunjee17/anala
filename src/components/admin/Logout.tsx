import { Button } from "react-daisyui";

export const Logout = () => {
	return (
		<Button
			color="neutral"
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
			Logout
		</Button>
	);
};
