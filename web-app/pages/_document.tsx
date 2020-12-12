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
