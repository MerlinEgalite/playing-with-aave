import { Row, Col } from 'antd'

import LayoutPage from '../components/LayoutPage'
import PageHeader from '../components/PageHeader'
import DepositForm from '../components/DepositForm'

export default function Deposit(): JSX.Element {
	return (
		<LayoutPage>
			<PageHeader linkToImage="/earth.png" title="Deposit" subtitle="" />
			<Row gutter={[0, 24]}>
				<Col md={{ span: 10, offset: 7 }} xs={{ span: 20, offset: 2 }}>
					<DepositForm />
				</Col>
			</Row>
		</LayoutPage>
	)
}
