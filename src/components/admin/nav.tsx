import { Link } from "@tanstack/react-router";
import { Button, Dropdown, Menu, Navbar } from "react-daisyui";
import { Logout } from "./logout.tsx";

export const Nav = () => {
	return (
		<>
			<Navbar>
				<Navbar.Start>
					<Dropdown>
						<Button
							tag="label"
							color="ghost"
							tabIndex={0}
							className="lg:hidden"
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								className="h-5 w-5"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<title>menu</title>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M4 6h16M4 12h8m-8 6h16"
								/>
							</svg>
						</Button>
						<Dropdown.Menu tabIndex={0} className="w-52 menu-sm mt-3 z-[1]">
							{/* biome-ignore lint/a11y/noNoninteractiveElementToInteractiveRole: <explanation> */}
							<li role="menuitem">
								<Link to="/posts"> Posts </Link>
							</li>
							<li>
								<a href={"#/"}>Extra</a>
								<ul className="p-2">
									<li>
										<Link to="/settings">Settings</Link>
									</li>
								</ul>
							</li>

							{/* biome-ignore lint/a11y/noNoninteractiveElementToInteractiveRole: <explanation> */}
							<li role="menuitem">
								<Link to="/account"> Account </Link>
							</li>
						</Dropdown.Menu>
					</Dropdown>
					<Link to="/dashboard" className="btn btn-ghost normal-case text-xl">
						{" "}
						Dashboard{" "}
					</Link>
				</Navbar.Start>
				<Navbar.Center className="hidden lg:flex">
					<Menu horizontal className="px-1">
						<Menu.Item>
							<Link to="/posts"> Posts </Link>
						</Menu.Item>
						<Menu.Item>
							<details>
								<summary>Extra</summary>
								<ul className="p-2">
									<Menu.Item>
										<Link to={"/settings"}>Settings</Link>
									</Menu.Item>
								</ul>
							</details>
						</Menu.Item>
						<Menu.Item>
							<Link to="/account"> Account </Link>
						</Menu.Item>
					</Menu>
				</Navbar.Center>
				<Navbar.End>
					<Logout />
				</Navbar.End>
			</Navbar>
		</>
	);
};
