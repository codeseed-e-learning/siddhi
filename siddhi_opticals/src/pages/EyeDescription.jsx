import React, { useState } from "react";

// Helper function to calculate ADD
const calculateAdd = (dValue, nValue) => {
    const d = parseFloat(dValue);
    const n = parseFloat(nValue);
    return !isNaN(d) && !isNaN(n) ? (d - n).toFixed(2) : "";
};

// Dropdown component to choose between + and -
const Dropdown = ({ options, name, value, onChange }) => {
    return (
        <select
            name={name}
            value={value}
            onChange={onChange}
            className="border p-2 w-full"
        >
            {options.map((option, index) => (
                <option key={index} value={option}>
                    {option}
                </option>
            ))}
        </select>
    );
};

const EyeDescription = () => {
    // State to store the values of the form
    const [eyeDescriptionData, seteyeDescriptionData] = useState({
        right_sph_D_sign: "+",
        right_sph_D: "",
        right_cyl_D_sign: "+",
        right_cyl_D: "",
        right_axis: "",
        right_sph_N_sign: "+",
        right_sph_N: "",
        right_cyl_N_sign: "+",
        right_cyl_N: "",
        right_axis_N: "",
        left_sph_D_sign: "+",
        left_sph_D: "",
        left_cyl_D_sign: "+",
        left_cyl_D: "",
        left_axis: "",
        left_sph_N_sign: "+",
        left_sph_N: "",
        left_cyl_N_sign: "+",
        left_cyl_N: "",
        left_axis_N: "",
    });
    // console.log(`Eye Descriptoin ${JSON.stringify(eyeDescriptionData)}`)

    // Handle form field changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        seteyeDescriptionData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };
    const [pd, setPd] = useState({ left: "", right: "" });

    const handlePdChange = (e) => {
        const { name, value } = e.target;
        setPd((prev) => ({ ...prev, [name]: value }));
    };

    const totalPd = parseFloat(pd.left || 0) + parseFloat(pd.right || 0);


    return (
        <div className="container mt-4 bg-white">
            <h2 className="text-center uppercase mt-2">Eye Description</h2>

            {/* Right Eye Form */}
            <div className="border p-4 mt-4">
                <h3 className="text-center font-bold">Right Eye</h3>
                <table className="w-full table-auto border">
                    <thead>
                        <tr>
                            <th className="border p-2">Type</th>
                            <th className="border p-2">SPH</th>
                            <th className="border p-2">CYL</th>
                            <th className="border p-2">Axis</th>
                        </tr>
                    </thead>
                    <tbody>
                        {/* Row for Distance (D) */}
                        <tr>
                            <td className="border p-2">D</td>
                            <td className="border p-2">
                                <Dropdown
                                    options={["+", "-"]}
                                    name="right_sph_D_sign"
                                    value={eyeDescriptionData.right_sph_D_sign}
                                    onChange={handleChange}
                                />
                                <input
                                    type="number"
                                    name="right_sph_D"
                                    value={eyeDescriptionData.right_sph_D}
                                    onChange={handleChange}
                                    className="border p-2 w-full"
                                    placeholder="Enter SPH (D)"
                                />
                            </td>
                            <td className="border p-2">
                                <Dropdown
                                    options={["+", "-"]}
                                    name="right_cyl_D_sign"
                                    value={eyeDescriptionData.right_cyl_D_sign}
                                    onChange={handleChange}
                                />
                                <input
                                    type="number"
                                    name="right_cyl_D"
                                    value={eyeDescriptionData.right_cyl_D}
                                    onChange={handleChange}
                                    className="border p-2 w-full"
                                    placeholder="Enter CYL (D)"
                                />
                            </td>
                            <td className="border p-2">
                                <input
                                    type="number"
                                    name="right_axis"
                                    value={eyeDescriptionData.right_axis}
                                    onChange={handleChange}
                                    className="border p-2 w-full"
                                    placeholder="Enter Axis"
                                />
                            </td>
                        </tr>
                        {/* Row for Near (N) */}
                        <tr>
                            <td className="border p-2">N</td>
                            <td className="border p-2">
                                <Dropdown
                                    options={["+", "-"]}
                                    name="right_sph_N_sign"
                                    value={eyeDescriptionData.right_sph_N_sign}
                                    onChange={handleChange}
                                />
                                <input
                                    type="number"
                                    name="right_sph_N"
                                    value={eyeDescriptionData.right_sph_N}
                                    onChange={handleChange}
                                    className="border p-2 w-full"
                                    placeholder="Enter SPH (N)"
                                />
                            </td>
                            <td className="border p-2">
                                <Dropdown
                                    options={["+", "-"]}
                                    name="right_cyl_N_sign"
                                    value={eyeDescriptionData.right_cyl_N_sign}
                                    onChange={handleChange}
                                />
                                <input
                                    type="number"
                                    name="right_cyl_N"
                                    value={eyeDescriptionData.right_cyl_N}
                                    onChange={handleChange}
                                    className="border p-2 w-full"
                                    placeholder="Enter CYL (N)"
                                />
                            </td>
                            <td className="border p-2">
                                <input
                                    type="number"
                                    name="right_axis_N"
                                    value={eyeDescriptionData.right_axis_N}
                                    onChange={handleChange}
                                    className="border p-2 w-full"
                                    placeholder="Enter Axis (N)"
                                />
                            </td>
                        </tr>
                        {/* ADD Calculation Row */}
                        <tr>
                            <td className="border p-2">ADD</td>
                            <td className="border p-2" colSpan="3">
                                <input
                                    type="text"
                                    value={calculateAdd(eyeDescriptionData.right_sph_D, eyeDescriptionData.right_sph_N)}
                                    readOnly
                                    className="border p-2 w-full"
                                    placeholder="ADD (auto-calculated)"
                                />
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            {/* Left Eye Form */}
            <div className="border p-4 mt-4">
                <h3 className="text-center font-bold">Left Eye</h3>
                <table className="w-full table-auto border">
                    <thead>
                        <tr>
                            <th className="border p-2">Type</th>
                            <th className="border p-2">SPH</th>
                            <th className="border p-2">CYL</th>
                            <th className="border p-2">Axis</th>
                        </tr>
                    </thead>
                    <tbody>
                        {/* Row for Distance (D) */}
                        <tr>
                            <td className="border p-2">D</td>
                            <td className="border p-2">
                                <Dropdown
                                    options={["+", "-"]}
                                    name="left_sph_D_sign"
                                    value={eyeDescriptionData.left_sph_D_sign}
                                    onChange={handleChange}
                                />
                                <input
                                    type="number"
                                    name="left_sph_D"
                                    value={eyeDescriptionData.left_sph_D}
                                    onChange={handleChange}
                                    className="border p-2 w-full"
                                    placeholder="Enter SPH (D)"
                                />
                            </td>
                            <td className="border p-2">
                                <Dropdown
                                    options={["+", "-"]}
                                    name="left_cyl_D_sign"
                                    value={eyeDescriptionData.left_cyl_D_sign}
                                    onChange={handleChange}
                                />
                                <input
                                    type="number"
                                    name="left_cyl_D"
                                    value={eyeDescriptionData.left_cyl_D}
                                    onChange={handleChange}
                                    className="border p-2 w-full"
                                    placeholder="Enter CYL (D)"
                                />
                            </td>
                            <td className="border p-2">
                                <input
                                    type="number"
                                    name="left_axis"
                                    value={eyeDescriptionData.left_axis}
                                    onChange={handleChange}
                                    className="border p-2 w-full"
                                    placeholder="Enter Axis"
                                />
                            </td>
                        </tr>
                        {/* Row for Near (N) */}
                        <tr>
                            <td className="border p-2">N</td>
                            <td className="border p-2">
                                <Dropdown
                                    options={["+", "-"]}
                                    name="left_sph_N_sign"
                                    value={eyeDescriptionData.left_sph_N_sign}
                                    onChange={handleChange}
                                />
                                <input
                                    type="number"
                                    name="left_sph_N"
                                    value={eyeDescriptionData.left_sph_N}
                                    onChange={handleChange}
                                    className="border p-2 w-full"
                                    placeholder="Enter SPH (N)"
                                />
                            </td>
                            <td className="border p-2">
                                <Dropdown
                                    options={["+", "-"]}
                                    name="left_cyl_N_sign"
                                    value={eyeDescriptionData.left_cyl_N_sign}
                                    onChange={handleChange}
                                />
                                <input
                                    type="number"
                                    name="left_cyl_N"
                                    value={eyeDescriptionData.left_cyl_N}
                                    onChange={handleChange}
                                    className="border p-2 w-full"
                                    placeholder="Enter CYL (N)"
                                />
                            </td>
                            <td className="border p-2">
                                <input
                                    type="number"
                                    name="left_axis_N"
                                    value={eyeDescriptionData.left_axis_N}
                                    onChange={handleChange}
                                    className="border p-2 w-full"
                                    placeholder="Enter Axis (N)"
                                />
                            </td>
                        </tr>
                        {/* ADD Calculation Row */}
                        <tr>
                            <td className="border p-2">ADD</td>
                            <td className="border p-2" colSpan="3">
                                <input
                                    type="text"
                                    value={calculateAdd(eyeDescriptionData.left_sph_D, eyeDescriptionData.left_sph_N)}
                                    readOnly
                                    className="border p-2 w-full"
                                    placeholder="ADD (auto-calculated)"
                                />
                            </td>
                        </tr>
                    </tbody>
                </table>
                <div className="mt-4">
                    <h3 className="text-center font-bold">PD Adjustment</h3>
                    <div className="flex justify-between items-center gap-4">
                        <div>
                            <label>Left PD:</label>
                            <input
                                type="number"
                                name="left"
                                value={pd.left}
                                onChange={handlePdChange}
                                className="border p-2 w-full"
                                placeholder="Enter Left PD"
                            />
                        </div>
                        <div>
                            <label>Right PD:</label>
                            <input
                                type="number"
                                name="right"
                                value={pd.right}
                                onChange={handlePdChange}
                                className="border p-2 w-full"
                                placeholder="Enter Right PD"
                            />
                        </div>
                        <div>
                            <label>Total PD:</label>
                            <input
                                type="text"
                                value={totalPd || ""}
                                readOnly
                                className="border p-2 w-full"
                                placeholder="Total PD"
                            />
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default EyeDescription;
