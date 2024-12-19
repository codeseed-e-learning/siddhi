import React from 'react'

const Payment = () => {
    return (
        <>
            <div className="mt-6 bg-white p-6 rounded-lg ">
                {/* Total Amount Section */}
                <div className="flex flex-col items-center md:items-start">
                    <h1 className="text-3xl font-extrabold text-gray-900">
                        ₹{billable.toFixed(2)}
                    </h1>
                    <p className="text-base text-gray-600 mt-1">
                        Your total bill amount
                    </p>
                </div>

                {/* Payment Options */}
                <div className="mt-6">
                    <label
                        htmlFor="paymentType"
                        className="block text-lg font-medium text-gray-800"
                    >
                        Choose Payment Method
                    </label>
                    <div className="flex items-center mt-3 space-x-4">
                        <button
                            type="button"
                            className={`px-4 py-2 rounded-lg border ${paymentType === "complete"
                                ? "bg-blue-600 text-white"
                                : "bg-gray-100 text-gray-800 hover:bg-blue-100"
                                }`}
                            onClick={() => handlePaymentSelection("complete")}
                        >
                            Complete Payment
                        </button>
                        <button
                            type="button"
                            className={`px-4 py-2 rounded-lg border ${paymentType === "advanced"
                                ? "bg-blue-600 text-white"
                                : "bg-gray-100 text-gray-800 hover:bg-blue-100"
                                }`}
                            onClick={() => handlePaymentSelection("advanced")}
                        >
                            Advanced Payment
                        </button>
                    </div>
                    {paymentType === "advanced" && (
                        <div className="mt-4">
                            <label
                                htmlFor="advancedAmount"
                                className="block text-sm font-medium text-gray-800"
                            >
                                Enter Advanced Amount
                            </label>
                            <input
                                type="number"
                                id="advancedAmount"
                                name="advancedAmount"
                                placeholder="Enter advanced amount"
                                value={advancedAmount}
                                onChange={handleAdvancedAmountChange}
                                className="w-full mt-2 border border-gray-300 rounded-lg p-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    )}
                </div>

                {/* Submit Button */}
                <div className="mt-8 flex justify-center">
                    <button
                        type="submit"
                        className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-10 py-3 rounded-full  hover:from-blue-600 hover:to-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 transition-all duration-300"
                    >
                        Confirm & Submit Order
                    </button>
                </div>
            </div>
        </>
    )
}

export default Payment