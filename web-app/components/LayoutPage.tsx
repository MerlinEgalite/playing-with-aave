import React from 'react'
import { Layout } from 'antd'
import Head from 'next/head'

import TopBar from './TopBar'

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
			<Layout.Header style={{ display: 'flex', justifyContent: 'space-between' }}>
				<TopBar />
			</Layout.Header>
			<Layout.Content>{children}</Layout.Content>
			<Layout.Footer style={{ textAlign: 'center' }}>
				<span role="img" aria-label="earth">
					🌍
				</span>{' '}
				The Cool Project
				<br />
				Dai address: 0xff795577d9ac8bd7d90ee22b6c1703490b6512fd
				<br />
				Credit Delegation contract address: 0xe979891Da8c2af95146ef2eE7C6eBD20cBda5F45
			</Layout.Footer>
		</Layout>
	)
}
