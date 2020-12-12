import React from 'react'
import { Layout, Row, Col } from 'antd'
import Head from 'next/head'
import styled from 'styled-components'

import TopBar from './TopBar'

interface Props {
	children?: React.ReactNode
}

export default function LayoutPage({ children }: Props): JSX.Element {
	return (
		<Layout style={{ minHeight: '100vh' }}>
			<Head>
			</Head>
			<Layout.Header style={{ display: 'flex', justifyContent: 'space-between' }}>
				<TopBar />
			</Layout.Header>
			<Layout.Content>{children}</Layout.Content>
			<Layout.Footer>
			</Layout.Footer>
		</Layout>
	)
}
