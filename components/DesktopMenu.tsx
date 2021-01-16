import React, { useContext } from 'react'
import { Menu } from 'antd'
import Link from 'next/link'
import styled from 'styled-components'

import AppContext from '../utils/app-context'

export default function DesktopMenu(): JSX.Element {
	const context = useContext(AppContext)
	const selectedMenuKey: string = context?.selectedMenuKey || 'home'

	const handleMenuOnClick = function (e: any): void {
		if (context?.setSelectedMenuKey) context?.setSelectedMenuKey(e.key)
	}

	return (
		<StyledDesktopMenu>
			<Menu
				style={{ border: 'none', minWidth: '400px' }}
				theme="light"
				mode="horizontal"
				defaultSelectedKeys={[selectedMenuKey]}
			>
				<Menu.Item onClick={handleMenuOnClick} key="/">
					<Link href="/">Home</Link>
				</Menu.Item>
				<Menu.Item onClick={handleMenuOnClick} key="deposit">
					<Link href="/deposit">Deposit</Link>
				</Menu.Item>
				<Menu.Item onClick={handleMenuOnClick} key="whitelist">
					<Link href="/whitelist">Whitelist</Link>
				</Menu.Item>
				<Menu.Item onClick={handleMenuOnClick} key="borrow">
					<Link href="/borrow">Borrow</Link>
				</Menu.Item>
			</Menu>
		</StyledDesktopMenu>
	)
}

const StyledDesktopMenu = styled.div`
	@media (max-width: 900px) {
		display: none;
	}
	text-align: center;
	margin: auto;
`
