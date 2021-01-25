import React from 'react'
import { Layout } from 'antd'
import Head from 'next/head'

import TopBar from './TopBar'

import addresses from '../contracts/addresses'

interface Props {
	children?: React.ReactNode
}

export default function LayoutPage({ children }: Props): JSX.Element {
	return (
		<Layout style={{ minHeight: '100vh' }}>
			<Head>
				<link
					href="https://fonts.googleapis.com/css?family=IBM+Plex+Mono:100,100i,200,200i,300,300i,400,400i,500,500i,600,600i,700,700i&amp;display=swap"
					rel="stylesheet"
				/>
			</Head>
			<Layout.Header
				style={{ display: 'flex', justifyContent: 'space-between' }}
			>
				<TopBar />
			</Layout.Header>
			<Layout.Content>{children}</Layout.Content>
			<Layout.Footer style={{ textAlign: 'center' }}>
				<span role="img" aria-label="earth">
					🌍
				</span>{' '}
				The Cool Project
				<br />
				First account: 0xFE3B557E8Fb62b89F4916B721be55cEb828dBd73
				<br />
				Second account: 0x627306090abaB3A6e1400e9345bC60c78a8BEf57
				<br />
				Dai address: 0xff795577d9ac8bd7d90ee22b6c1703490b6512fd
				<br />
				Credit Delegation contract address: {addresses.simpleCreditDelegation}
			</Layout.Footer>
		</Layout>
	)
}
