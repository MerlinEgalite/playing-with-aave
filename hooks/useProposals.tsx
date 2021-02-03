import { useContext } from 'react'

import { ethers } from 'ethers'
import addresses from '../contracts/addresses'
import CVCDJson from '../contracts/abis/ConvictionVotingCreditDelegation.json'

import AppContext from '../utils/app-context'

export default function useProposals(): any {
	const context = useContext(AppContext)

	const CVCDAddress = addresses.convictionVotingCreditDelegation
	const CVCDAbi = CVCDJson.abi
	const signer = context?.web3Provider?.getSigner()
	const CVCDContract = new ethers.Contract(CVCDAddress, CVCDAbi, signer)

	const proposalCounter = CVCDContract.proposalCounter
	const proposals = []
	for (const id in proposalCounter) {
		proposals.push(CVCDContract.getProposal(id))
	}

	const proposalsWithData = proposals.map((proposalId: any, item: any) => {
		// TODO: add other data (voting, etc)
		return { ...item, proposalId }
	})

	return [proposalsWithData]
}
