import { Row, Button, Col } from 'antd'
import Link from 'next/link'
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
				subtitle="Lend your money to valuable project or borrow if the community think you worth it"
			/>
			<Row gutter={[0, 24]}>
				<Col style={{ textAlign: 'center' }} md={{ span: 14, offset: 5 }} xs={{ span: 20, offset: 2 }}>
					<Button onClick={() => router.push('/deposit')}>
						<span style={{ textDecoration: 'underline' }}>Deposit Collateral</span>
					</Button>
					<Button onClick={() => router.push('/whitelist')}>
						<span style={{ textDecoration: 'underline' }}>Whitelist Borrow</span>
					</Button>
					<Button onClick={() => router.push('/borrow')}>
						<span style={{ textDecoration: 'underline' }}>Borrow</span>
					</Button>
				</Col>
			</Row>
		</LayoutPage>
	)
}


