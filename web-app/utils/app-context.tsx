import { createContext } from 'react'
import Web3Modal from 'web3modal'
import { Web3Provider } from '@ethersproject/providers'

export interface IAppContext {
	initialized?: boolean
	selectedMenuKey?: string
	web3Modal?: Web3Modal | null
	web3Provider?: Web3Provider | null
	address?: string | null
	isWhitelistedWallet?: boolean
	setWeb3Modal?: (web3Modal: Web3Modal) => void
	setWeb3Provider?: (web3Provider: Web3Provider) => void
	setSelectedMenuKey?: (key: string) => void
	setAddress?: (address: string) => void
	setIsWhitelistedWallet?: (isWhitelistedWallet: boolean) => void
}

const AppContext = createContext<IAppContext>({})

export default AppContext
