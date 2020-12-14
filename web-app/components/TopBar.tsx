import dynamic from 'next/dynamic'
import styled from 'styled-components'
import Link from 'next/link'

import DesktopMenu from './DesktopMenu'

const WalletButton = dynamic((): Promise<any> => import('./WalletButton'), { ssr: false })

export default function TopBar(): JSX.Element {
	return (
		<StyledTopBar>
			<Link href="/">
				<StyledLogo>
					<StyledText>🌍 The Cool Project</StyledText>
				</StyledLogo>
			</Link>
			<StyledDesktopMenuWrapper>
				<DesktopMenu/>
			</StyledDesktopMenuWrapper>
			<WalletButton/>
		</StyledTopBar>
	)
}

const StyledTopBar = styled.div`
	align-items: center;
	display: flex;
	height: 72px;
	justify-content: space-between;
	width: 100%;
`

const StyledLogo = styled.div`
	@media (max-width: 1100px) {
		display: none;
	}

	float: left;
	cursor: pointer;
	display: flex;
	justify-content: space-between;
	align-items: center;
`

const StyledText = styled.span`
	color: #202020;
	font-size: 18px;
	font-weight: 700;
	margin-left: 20px;
	@media (max-width: 400px) {
		display: none;
	}
`

const StyledDesktopMenuWrapper = styled.div`
	@media (max-width: 768px) {
		display: none;
	}
`

