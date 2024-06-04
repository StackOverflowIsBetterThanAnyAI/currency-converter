import { ChangeEvent, useState } from 'react'
import { BlockInvalidChar } from '../utils/BlockInvalidChar'

import { API_KEY } from '../api/api'

const Form = () => {
    const [currentAmount, setCurrentAmount] = useState<number | ''>('')
    const [currencyFrom, setCurrencyFrom] = useState<string>('AUD')
    const [currencyTo, setCurrencyTo] = useState<string>('CHF')
    const [resultText, setResultText] = useState<string>('')
    const [loading, setLoading] = useState(false)
    const [toggleHidden, setToggleHidden] = useState({
        one: false,
        two: false,
        three: false,
    })
    const apiURL = 'https://api.api-ninjas.com/v1/convertcurrency'
    let loadConst = false

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

    const handleConversion = async () => {
        const url = `${apiURL}?have=${currencyFrom}&want=${currencyTo}&amount=${currentAmount}`

        setLoading(true)
        loadConst = true
        startLoadingAnimation({ counter: 1 })

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
                : !response.ok
                ? setResultText(`HTTP error! Status: ${response.status}`)
                : setResultText(
                      `JSON Error! Received ${conversion} for new_amount`
                  )

            if (!response.ok) {
                throw new Error(
                    `HTTP error! Status: ${response.status} on ${response.url}`
                )
            }

            if (!conversion) {
                throw new Error(
                    `JSON Error! Received ${conversion} for new_amount`
                )
            }
        } catch (error: any) {
            console.error('Request failed: ', error.message)
        }

        setLoading(false)
        loadConst = false
    }

    const startLoadingAnimation = ({ counter }: { counter: number }) => {
        if (loadConst) {
            switch (counter % 6) {
                case 0:
                    setToggleHidden({
                        one: true,
                        two: false,
                        three: false,
                    })
                    break
                case 1:
                    setToggleHidden({
                        one: true,
                        two: true,
                        three: false,
                    })
                    break
                case 2:
                    setToggleHidden({
                        one: true,
                        two: false,
                        three: false,
                    })
                    break
                case 3:
                    setToggleHidden({
                        one: false,
                        two: false,
                        three: true,
                    })
                    break
                case 4:
                    setToggleHidden({
                        one: false,
                        two: true,
                        three: true,
                    })
                    break
                case 5:
                    setToggleHidden({
                        one: false,
                        two: false,
                        three: true,
                    })
                    break
            }
            setTimeout(
                () => startLoadingAnimation({ counter: counter + 1 }),
                150
            )
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
                    autoFocus
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
                onClick={handleConversion}
                disabled={
                    !currentAmount ||
                    !currencyFrom ||
                    !currencyTo ||
                    currencyFrom === currencyTo ||
                    loading
                }
            >
                Convert
            </button>
            {loading ? (
                <div className="loading">
                    <span
                        style={{
                            visibility: toggleHidden.one ? 'hidden' : 'visible',
                        }}
                    >
                        {' '}
                        .{' '}
                    </span>
                    <span
                        style={{
                            visibility: toggleHidden.two ? 'hidden' : 'visible',
                        }}
                    >
                        {' '}
                        .{' '}
                    </span>
                    <span
                        style={{
                            visibility: toggleHidden.three
                                ? 'hidden'
                                : 'visible',
                        }}
                    >
                        {' '}
                        .{' '}
                    </span>
                </div>
            ) : (
                resultText && <div className="result">{resultText}</div>
            )}
        </div>
    )
}

export default Form
