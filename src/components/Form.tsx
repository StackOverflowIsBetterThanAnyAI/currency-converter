import { ChangeEvent, useState } from 'react'
import { BlockInvalidChar } from '../utils/BlockInvalidChar'

import { API_KEY } from '../api/api'

const Form = () => {
    const [currentAmount, setCurrentAmount] = useState<number | ''>('')
    const [currencyFrom, setCurrencyFrom] = useState<string>('AUD')
    const [currencyTo, setCurrencyTo] = useState<string>('CHF')
    const [resultText, setResultText] = useState<string>('')
    const currentURL = 'https://api.api-ninjas.com/v1/convertcurrency'
    const handleCurrentAmount = (e: ChangeEvent<HTMLInputElement>) => {
        !isNaN(parseFloat(e.target.value))
            ? setCurrentAmount(parseInt(e.target.value))
            : setCurrentAmount('')
    }

    const handleCurrencyFrom = (e: ChangeEvent<HTMLSelectElement>) => {
        setCurrencyFrom(e.target.value)
    }

    const handleCurrencyTo = (e: ChangeEvent<HTMLSelectElement>) => {
        setCurrencyTo(e.target.value)
    }

    const handleConvertion = async () => {
        const url = `${currentURL}?have=${currencyFrom}&want=${currencyTo}&amount=${currentAmount}`
        try {
            const response = await fetch(url, {
                headers: {
                    'X-API-KEY': API_KEY,
                },
            })
            const data = await response.json()
            const conversion = await (data as any).new_amount
            conversion
                ? setResultText(
                      `${currentAmount} ${currencyFrom} equals ${conversion} ${currencyTo}`
                  )
                : setResultText(`HTTP error! Status: ${response.status}`)
            if (!response.ok) {
                throw new Error(
                    `HTTP error! Status: ${response.status} on ${response.url}`
                )
            }
        } catch (error: any) {
            console.error('Request failed: ', error.message)
        }
    }

    return (
        <div className="formContainer">
            <div className="labelContainer">
                <label htmlFor="amount">Amount:</label>
                <input
                    id="amount"
                    type="number"
                    min={0}
                    placeholder="Enter the amount."
                    value={currentAmount}
                    onKeyDown={BlockInvalidChar}
                    onChange={handleCurrentAmount}
                />
            </div>
            <div className="labelContainer">
                <label htmlFor="currencyFrom">From:</label>
                <select
                    id="currencyFrom"
                    onChange={handleCurrencyFrom}
                    defaultValue="AUD"
                >
                    <option value="AUD">AUD</option>
                    <option value="CHF">CHF</option>
                    <option value="CNY">CNY</option>
                    <option value="DKK">DKK</option>
                    <option value="GBP">GBP</option>
                    <option value="HKD">HKD</option>
                    <option value="KRW">KRW</option>
                    <option value="NZD">NZD</option>
                    <option value="PLN">PLN</option>
                    <option value="TRY">TRY</option>
                </select>
            </div>
            <div className="labelContainer">
                <label htmlFor="currencyTo">To:</label>
                <select
                    id="currencyTo"
                    onChange={handleCurrencyTo}
                    defaultValue="CHF"
                >
                    <option value="AUD">AUD</option>
                    <option value="CHF">CHF</option>
                    <option value="CNY">CNY</option>
                    <option value="DKK">DKK</option>
                    <option value="GBP">GBP</option>
                    <option value="HKD">HKD</option>
                    <option value="KRW">KRW</option>
                    <option value="NZD">NZD</option>
                    <option value="PLN">PLN</option>
                    <option value="TRY">TRY</option>
                </select>
            </div>
            <button
                onClick={handleConvertion}
                disabled={
                    !currentAmount ||
                    !currencyFrom ||
                    !currencyTo ||
                    currencyFrom === currencyTo
                }
            >
                Convert
            </button>
            {resultText && <div className="result">{resultText}</div>}
        </div>
    )
}

export default Form
