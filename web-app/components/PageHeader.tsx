import React from 'react'
import styled from 'styled-components'
import { Space } from 'antd'

interface PageHeaderProps {
	linkToImage: string
	subtitle?: string
	title?: string
}

export default function PageHeader(props: PageHeaderProps): JSX.Element {
	return (
		<StyledPageHeader>
			<img src={props.linkToImage} alt="image" style={{ height: 96, width: 96 }} />
			<Space />
			<StyledTitle>{props.title}</StyledTitle>
			{props.subtitle && <StyledSubtitle>{props.subtitle}</StyledSubtitle>}
		</StyledPageHeader>
	)
}

const StyledPageHeader = styled.div`
	align-items: center;
	box-sizing: border-box;
	display: flex;
	flex-direction: column;
	padding-top: 72px;
	padding-bottom: 36px;
	margin: 0 auto;
`

const StyledTitle = styled.h1`
	color: black;
	font-size: 36px;
	font-weight: 700;
	margin: 0;
	padding: 0;
	text-align: center;
`

const StyledSubtitle = styled.h3`
	color: rgb(20, 1, 8);
	font-size: 18px;
	font-weight: 400;
	margin: 0;
	opacity: 0.66;
	padding: 0;
	text-align: center;
`
