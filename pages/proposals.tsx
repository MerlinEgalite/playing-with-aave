import { Row, Col } from 'antd'

import LayoutPage from '../components/LayoutPage'
import PageHeader from '../components/PageHeader'
import ProposalForm from '../components/ProposalForm'
import ProjectsList from '../components/ProjectsList'

export default function Lend(): JSX.Element {
	return (
		<LayoutPage>
			<PageHeader
				linkToImage="/earth.png"
				title="Project Proposals"
				subtitle="Add a proposal or vote on project proposals."
			/>
			<Row gutter={[0, 24]}>
				<Col md={{ span: 10, offset: 7 }} xs={{ span: 20, offset: 2 }}>
					<ProposalForm />
				</Col>
			</Row>
			<Row gutter={[0, 24]} style={{ margin: '64px 0px' }}>
				<Col md={{ span: 16, offset: 4 }} xs={{ span: 20, offset: 2 }}>
					<ProjectsList />
				</Col>
			</Row>
		</LayoutPage>
	)
}
