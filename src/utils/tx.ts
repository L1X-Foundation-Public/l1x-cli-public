export async function retryTransaction(_transactionFunction: any, retries: number) {
  try {
    let _response = await _transactionFunction()
    // console.log('Response', _response)
    return _response
  } catch (error: any) {
    if (retries > 0) {
    //   console.log(`Transaction failed. Retrying... (${retries} retries left`)
      await sleep(3) // Wait for 1 second before retrying
      return retryTransaction(_transactionFunction, retries - 1)
    } else {
      throw error?.body ? error : new Error(`Transaction failed after multiple retries: ${error.message}`)
    }
  }
}

export function sleep(seconds: number) {
  return new Promise((resolve) => setTimeout(resolve, seconds * 1000))
}
