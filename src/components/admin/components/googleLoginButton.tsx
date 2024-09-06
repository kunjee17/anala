import { Button } from "react-daisyui";

export const GoogleLoginButton = ({
	login,
	loading,
}: { login: () => Promise<void>; loading: boolean }) => {
	return (
		<Button type={"button"} loading={loading} onClick={login}>
			<svg
				aria-hidden="true"
				focusable="false"
				data-prefix="fab"
				data-icon="google"
				className="w-5 h-5 mr-2 svg-inline--fa fa-google fa-w-16"
				role="img"
				xmlns="http://www.w3.org/2000/svg"
				viewBox="0 0 488 512"
			>
				<title>Google Login Icon</title>
				<path
					fill="currentColor"
					d="M488 261.8C488 403.3 391.2 512 248 512 110.8 512 0 401.2 0 264S110.8 16 248 16c66.8 0 122.9 24.4 167.4 64.1l-67.9 64.7C319.2 105.5 286.8 96 248 96c-99.8 0-180.6 82.8-180.6 184s80.8 184 180.6 184c83.6 0 137.6-47.8 144-111H248v-89.5h240c2.3 13.7 4 27.3 4 41.8z"
				/>
			</svg>
			Sign in with Google
		</Button>
	);
};
