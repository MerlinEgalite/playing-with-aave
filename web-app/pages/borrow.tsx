import { Row, Col } from 'antd'

import LayoutPage from '../components/LayoutPage'
import PageHeader from '../components/PageHeader'

export default function App(): JSX.Element {

	return (
		<LayoutPage>
			<PageHeader
				linkToImage="/earth.png"
				title="Borrow"
				subtitle=""
			/>
			<Row gutter={[0, 24]}>
				<Col style={{ textAlign: 'center' }} md={{ span: 14, offset: 5 }} xs={{ span: 20, offset: 2 }}>
				</Col>
			</Row>
		</LayoutPage>
	)
}
