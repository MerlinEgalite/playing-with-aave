import { Row, Col } from 'antd'

import LayoutPage from '../../components/LayoutPage'
import PageHeader from '../../components/PageHeader'
import DepositForm from '../../components/DepositForm'
import WhitelistForm from '../../components/WhitelistForm'

export default function Lend(): JSX.Element {
	return (
		<LayoutPage>
			<PageHeader
				linkToImage="/earth.png"
				title="Lend"
				subtitle="Deposit and whitelist an Ethereum address to lend DAI to."
			/>
			<Row gutter={[0, 24]}>
				<Col md={{ span: 10, offset: 7 }} xs={{ span: 20, offset: 2 }}>
					<DepositForm />
				</Col>
				<Col md={{ span: 10, offset: 7 }} xs={{ span: 20, offset: 2 }}>
					<WhitelistForm />
				</Col>
			</Row>
		</LayoutPage>
	)
}
