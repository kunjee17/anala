import { Button, Dropdown, Menu, Navbar } from "react-daisyui";
import { Logout } from "./Logout.tsx";

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
							<Dropdown.Item href={"/admin/posts"}>Blogs</Dropdown.Item>
							<li>
								<a href={"#/"}>Extra</a>
								<ul className="p-2">
									<li>
										<a href={"/admin/settings"}>Settings</a>
									</li>
									<li>
										<a href={"/admin/theme"}>Theme</a>
									</li>
								</ul>
							</li>
							<Dropdown.Item href={"/admin/account"}>Account</Dropdown.Item>
						</Dropdown.Menu>
					</Dropdown>
					<a
						href={"/admin/dashboard"}
						className="btn btn-ghost normal-case text-xl"
					>
						Dashboard
					</a>
				</Navbar.Start>
				<Navbar.Center className="hidden lg:flex">
					<Menu horizontal className="px-1">
						<Menu.Item>
							<a href={"/admin/posts"}>Posts</a>
						</Menu.Item>
						<Menu.Item>
							<details>
								<summary>Extra</summary>
								<ul className="p-2">
									<Menu.Item>
										<a href={"/admin/settings"}>Settings</a>
									</Menu.Item>
									<Menu.Item>
										<a href={"/admin/theme"}>Theme</a>
									</Menu.Item>
								</ul>
							</details>
						</Menu.Item>
						<Menu.Item>
							<a href={"/admin/account"}>Account</a>
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
