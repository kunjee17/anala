import { useLocalStorageValue } from "@react-hookz/web";
export const ThemeSettings = () => {
	//TODO: will save to firebase config
	const { set, value } = useLocalStorageValue<string>("theme", {
		defaultValue: "light",
		initializeWithValue: true,
		parse: (str) => str,
		stringify: (value) => value,
	});
	return (
		<>
			<select
				onChange={(e) => set(e.target.value)}
				value={value || "light"}
				className="select w-full max-w-xs"
			>
				<option value={"light"}>Light</option>
				<option value={"dark"}>Dark</option>
				<option value={"cupcake"}>Cupcake</option>
			</select>
			<p>Current selected theme {value}</p>
		</>
	);
};
