import Document, { Html, Head, Main, NextScript } from 'next/document'
import React from 'react'
import { ServerStyleSheet } from 'styled-components'

interface IProps {
	styleTags: Array<React.ReactElement<Record<string, unknown>>>
}

export default class MyDocument extends Document<IProps> {
	// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
	static getInitialProps({ renderPage }: any): any {
		const sheet = new ServerStyleSheet()
		const page = renderPage((App: any) => (props: any) => sheet.collectStyles(<App {...props} />))

		const styleTags = sheet.getStyleElement()
		return { ...page, styleTags }
	}

	render(): JSX.Element {
		return (
			<Html>
				<Head>
					<link
						href="https://fonts.googleapis.com/css?family=IBM+Plex+Mono:100,100i,200,200i,300,300i,400,400i,500,500i,600,600i,700,700i&amp;display=swap"
						rel="stylesheet"
					/>
					{this.props.styleTags}
				</Head>
				<body>
					<Main />
					<NextScript />
				</body>
			</Html>
		)
	}
}
