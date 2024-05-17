import { writeFile, writeFileSync } from 'fs';
import { readFile } from 'fs/promises'
import ResponseService, { ResponseBag } from './ResponseService.js';
import Wallet from 'ethereumjs-wallet';
import {isAddress} from 'web3-validator';
import ConfigService from './ConfigService.js';


export type L1XWalletType = {
    address: string,
    privateKey: string
}

export type L1XWalletStoreType = {
    defaultAccount: string,
    wallets: Array<L1XWalletType>
}

export default class WalletService {
 
  public static async getWalletByAddress(address: string) : Promise<ResponseBag>{
    // Check if wallet is created
    let isWalletCreated = await WalletService.isWalletStoreCreated();
    if(!isWalletCreated){
        return ResponseService.sendError(null, "Wallet store not created");
    }

    // Read Wallet
    let walletStore = await WalletService.readWalletStore();
    if(walletStore == null){
        return ResponseService.sendError(null, "Error reading wallet store");
    }

    // Get Wallet
    let wallet = walletStore.wallets.find((wallet) => wallet.address == address);
    if(wallet == undefined){
        return ResponseService.sendError(null, "Wallet not found, Please import wallet first");
    }

    return ResponseService.sendSuccess(wallet, "Wallet found");

  }
  public static async getAllWallets() : Promise<ResponseBag>{
    // Check if wallet is created
    let isWalletCreated = await WalletService.isWalletStoreCreated();
    if(!isWalletCreated){
        return ResponseService.sendError(null, "Wallet store not created");
    }

    // Read Wallet
    let walletStore = await WalletService.readWalletStore();
    if(walletStore == null){
        return ResponseService.sendError(null, "Error reading wallet store");
    }

    return ResponseService.sendSuccess(walletStore.wallets, "Wallets found");
  }

  public static async addWallet(wallet: L1XWalletType) : Promise<ResponseBag>{

    let isFirstWallet = false;

    // Check if wallet is created
    let isWalletCreated = await WalletService.isWalletStoreCreated();
    if(!isWalletCreated){

        // If wallet is not created, initiate wallet
        let isWalletInitialized = await WalletService.initiateWalletStore();
        if(isWalletInitialized == null){
            return ResponseService.sendError(null, "Error initializing wallet store");
        }

        isFirstWallet = true;
    }

    // Read Wallet
    let walletStore = await WalletService.readWalletStore();
    if(walletStore == null){
        return ResponseService.sendError(null, "Error reading wallet store");
    }

    // Check if wallet already exists
    let walletExists = walletStore.wallets.find((w) => w.address == wallet.address);
    if(walletExists != undefined){
        return ResponseService.sendError(null, "Wallet already exists");
    }

    // Add Wallet
    walletStore.wallets.push(wallet);

    // Set Default Account if First Wallet
    if(isFirstWallet){
        walletStore.defaultAccount = wallet.address;
    }

    // Write Wallet
    try {
        await writeFileSync(ConfigService.defaultWalletPath, JSON.stringify(walletStore,null,2));
        return ResponseService.sendSuccess(wallet, "Wallet added");
    }
    catch{
        return ResponseService.sendError(null, "Error writing wallet store");
    }
  }

  public static async getDefaultWallet() : Promise<ResponseBag>{
    // Check if wallet is created
    let isWalletCreated = await WalletService.isWalletStoreCreated();
    if(!isWalletCreated){
        return ResponseService.sendError(null, "Wallet store not created");
    }

    // Read Wallet
    let walletStore = await WalletService.readWalletStore();
    if(walletStore == null){
        return ResponseService.sendError(null, "Error reading wallet store");
    }

    return ResponseService.sendSuccess(walletStore.defaultAccount, "Default wallet found");
  }

  public static async setDefaultWallet(address: string) : Promise<ResponseBag>{
    // Check if wallet is created
    let isWalletCreated = await WalletService.isWalletStoreCreated();
    if(!isWalletCreated){
        return ResponseService.sendError(null, "Wallet store not created");
    }

    // Read Wallet
    let walletStore = await WalletService.readWalletStore();
    if(walletStore == null){
        return ResponseService.sendError(null, "Error reading wallet store");
    }

    // Get Wallet
    let wallet = walletStore.wallets.find((wallet) => wallet.address == address);
    if(wallet == undefined){
        return ResponseService.sendError(null, "Wallet not found, Please add wallet first");
    }

    // Set Default Account
    walletStore.defaultAccount = address;

    // Write Wallet
    try {
        await writeFileSync(ConfigService.defaultWalletPath, JSON.stringify(walletStore,null,2));
        return ResponseService.sendSuccess(wallet, "Default wallet set");
    }
    catch{
        return ResponseService.sendError(null, "Error writing wallet store");
    }
  }
  

  public static async isWalletStoreCreated(): Promise<boolean>{
    try {
      const data = await readFile(ConfigService.defaultWalletPath, 'utf-8')
      return true
    }
    catch (error) {
      return false; 
    }
  }


  public static async readWalletStore(): Promise<L1XWalletStoreType|null>{
    try {
      const data = await readFile(ConfigService.defaultWalletPath, 'utf-8')
      return JSON.parse(data)
    }
    catch (error) {
      return null; 
    }
  }

  public static async initiateWalletStore(): Promise<boolean|null>{
    try {
        await writeFileSync(ConfigService.defaultWalletPath, JSON.stringify({
            "defaultAccount": "DEFAULT",
            "wallets": []
        },null,2));

        return true;
    }
    catch{
        return null
    }
  }

  public static getWalletByPrivateKey(privateKey: string): L1XWalletType{
    let wallet = Wallet.default.fromPrivateKey(Buffer.from(privateKey, 'hex'));
    return {
        address: wallet.getAddressString(),
        privateKey: wallet.getPrivateKeyString()
    };
  }
  
  public static isValidAddress(address: string): boolean{
    // return Web3Validator.isAddress(address);
    return isAddress(address);
  }
}