import { Row, Button, Col } from 'antd'
import { useRouter } from 'next/router'

import LayoutPage from '../components/LayoutPage'
import PageHeader from '../components/PageHeader'

export default function App(): JSX.Element {
	const router = useRouter()

	return (
		<LayoutPage>
			<PageHeader
				linkToImage="/earth.png"
				title="Make the planet great again"
				subtitle="Lend your money to valuable project or borrow the community think you worth it"
			/>
			<Row gutter={[0, 24]}>
				<Col style={{ textAlign: 'center' }} md={{ span: 14, offset: 5 }} xs={{ span: 20, offset: 2 }}>
					<Button onClick={() => router.push('/deposit')}>Deposit Collateral</Button>
					<Button onClick={() => router.push('/whitelist')}>Whitelist Borrow</Button>
					<Button onClick={() => router.push('/borrow')}>Borrow</Button>
				</Col>
			</Row>
		</LayoutPage>
	)
}


