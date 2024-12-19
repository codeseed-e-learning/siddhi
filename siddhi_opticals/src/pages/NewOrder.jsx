// client/siddhi_opticals/src/pages/NewOrder.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import Navbar from "../components/Navbar";
import HomeButton from "../components/Homebutton";
import axios from "axios";
import Dropdown from "../components/Dropdown";
import Swal from "sweetalert2";
import { API_BASE_URL } from "../Api";
import EyeDescription from "./EyeDescription";

const InputField = ({
  label,
  name,
  type = "text",
  value,
  onChange,
  required,
  ...props
}) => (
  <div>
    <label htmlFor={name} className="block text-sm font-medium text-gray-700">
      {label}
    </label>
    <input
      type={type}
      name={name}
      id={name}
      value={value}
      onChange={onChange}
      className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
      required={required}
      {...props}
    />
  </div>
);

const NewOrder = ({ showButton = true }) => {
  const navigate = useNavigate();
  const [customers, setCustomers] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [framestock, setframestock] = useState([]);
  const [framePrice, setFramePrice] = useState(0); // Initialize framePrice
  const [lensPrice, setLensPrice] = useState(0); // Initialize lensPrice
  const [totalBill, setTotalBill] = useState(0); // Initialize totalBill
  const [formData, setFormData] = useState({
    order_taken_date: "",
    estimate_completion_date: "",
    firstname: "",
    lastname: "",
    age: "",
    gender: "",
    address: "",
    mobile: "",
    type: "doctor", // default to doctor
    doctor_name: "",
    hospital: "",
    doctor_city: "",
    shop_name: "",
    optician_city: "",
    specs: {
      specsframeType: "",
      specsframeModelName: "",
      specsframeModelCode: "",
      specsframeModelColor: "",
      specsframeSize: "",
      specsframePrice: 0,
      specslensFor: "",
      specslensType: "",
      specswhichSide: "",
      specslensCompanyName: "",
      specslensProductName: "",
      specsdia: "",
      specsindex: "",
      specslensPrice: 0,
    },
    frame: {
      frameType: "", // You can keep this if needed
      frameModelName: "", // You can keep this if needed
      frameModelCode: "", // You can keep this if needed
      frameModelColor: "", // You can keep this if needed
      frameSize: "", // You can keep this if needed
      framePrice: 0, // You can keep this if needed
    },
    lens: {
      lensType: "", // You can keep this if needed
      lensCompanyName: "", // You can keep this if needed
      lensProductName: "", // You can keep this if needed
      lensdia: "",
      lensindex: "",
      lensPrice: 0,
    },
    whichSide: "",
    lensCompanyName: "",
    lensProductName: "",
    totalBill: "",
  });

  const [selectedOrderDetails, setSelectedOrderDetails] = useState({
    fullSpecs: false,
    onlyFrameSunglasses: false,
    onlyLensContactLens: false,
  });

  const [lensData, setLensData] = useState({
    lensFor: "",
    lensType: "",
    whichSide: "",
    lensCompanyName: "",
    lensProductName: "",
    index: "",
    dia: "",
    lensPrice: "",
  });

  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [frameDetails, setFrameDetails] = useState({});

  const [billable, setBillable] = useState(0);

  const [paymentType, setPaymentType] = useState("completed"); // Initialize payment type
  const [advancedAmount, setAdvancedAmount] = useState(""); // Initialize advanced amount

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleOrderDetailChange = (e) => {
    const { value } = e.target;
    // Set the selected option based on the radio button value
    setSelectedOrderDetails({
      fullSpecs: value === "fullSpecs",
      onlyFrameSunglasses: value === "onlyFrameSunglasses",
      onlyLensContactLens: value === "onlyLensContactLens",
    });
  };

  const handleLensChange = (e) => {
    const { name, value } = e.target;
    setLensData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePaymentSelection = (type) => {
    setPaymentType(type); // Update payment type
  };

  const handleAdvancedAmountChange = (e) => {
    setAdvancedAmount(e.target.value); // Update advanced amount
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // console.log("Form Data before submission:", JSON.stringify(formData , null , 2)); // Log form data

    // Check if firstname and lastname are provided
    if (!formData.firstname || !formData.lastname) {
      Swal.fire({
        title: "Error!",
        text: "Firstname and Lastname are required.",
        icon: "error",
        confirmButtonText: "OK",
      });
      return; // Prevent submission
    }

    // Transforming the data into the required format
    const dataToSend = [
      {
        orderDetails: {
          order_information: {
            orderDate: formData.order_taken_date.split("-").reverse().join("-"), // Format to DD-MM-YYYY
            estimateCompletionDate: formData.estimate_completion_date.split("-").reverse().join("-"), // Format to DD-MM-YYYY
          },
          specs: {
            specsframeType: formData.specs.specsframeType,
            specsframeModelName: formData.specs.specsframeModelName,
            specsframeModelCode: formData.specs.specsframeModelCode,
            specsframeModelColor: formData.specs.specsframeModelColor,
            specsframeSize: formData.specs.specsframeSize,
            specsframePrice: parseFloat(formData.specs.specsframePrice) || 0, // Ensure framePrice is a number
            specslensFor: formData.specs.specslensFor,
            specslensType: formData.specs.specslensType,
            specswhichSide: formData.specs.specswhichSide,
            specslensCompanyName: formData.specs.specslensCompanyName,
            specslensProductName: formData.specs.specslensProductName,
            specsdia: formData.specs.specsdia,
            specsindex: formData.specs.specsindex,
            specslensPrice: parseFloat(formData.specs.specslensPrice) || 0, // Ensure lensPrice is a number
          },
          frame: {
            frameType: formData.frame.frameType,
            frameModelName: formData.frame.frameModelName,
            frameModelCode: formData.frame.frameModelCode,
            frameModelColor: formData.frame.frameModelColor,
            frameSize: formData.frame.frameSize,
            framePrice: parseFloat(formData.frame.framePrice) || 0, // Ensure framePrice is a number
          },
          lens: {
            lensType: formData.lens.lensType,
            lensCompanyName: formData.lens.lensCompanyName,
            lensProductName: formData.lens.lensProductName,
            lensdia: formData.lens.lensdia,
            lensindex: formData.lens.lensindex,
            lensPrice: parseFloat(formData.lens.lensPrice) || 0, // Ensure lensPrice is a number
          },
          userDetails: {
            firstname: formData.firstname.toLowerCase(),
            lastname: formData.lastname.toLowerCase(),
            age: formData.age,
            gender: formData.gender,
            address: formData.address,
            mobile: formData.mobile,
          },
          doctorDetails: {
            doctorName: formData.doctor_name,
            hospital: formData.hospital,
            doctorCity: formData.doctor_city,
          },
          paymentDetails: {
            payamount: billable.toFixed(2), // Updated to use billable value
            advancedAmount: paymentType === "advanced" ? advancedAmount : billable.toFixed(2),
          },
          totalBill: Math.floor(billable), // Convert totalBill to an integer
          payment_status: paymentType === "advanced" ? "unpaid" : "paid",
        },
        eyeDescription: {
          rightEye: {
            right_sph_D_sign: formData.right_sph_D_sign,
            right_sph_D: formData.right_sph_D,
            right_cyl_D_sign: formData.right_cyl_D_sign,
            right_cyl_D: formData.right_cyl_D,
            right_axis: formData.right_axis,
            right_sph_N_sign: formData.right_sph_N_sign,
            right_sph_N: formData.right_sph_N,
            right_cyl_N_sign: formData.right_cyl_N_sign,
            right_cyl_N: formData.right_cyl_N,
            right_axis_N: formData.right_axis_N,
            right_sph_add: formData.right_sph_add,
            right_cyl_add: formData.right_cyl_add,
            right_axis_add: formData.right_axis_add,
          },

          leftEye: {
            left_sph_D_sign: formData.left_sph_D_sign,
            left_sph_D: formData.left_sph_D,
            left_cyl_D_sign: formData.left_cyl_D_sign,
            left_cyl_D: formData.left_cyl_D,
            left_axis: formData.left_axis,
            left_sph_N_sign: formData.left_sph_N_sign,
            left_sph_N: formData.left_sph_N,
            left_cyl_N_sign: formData.left_cyl_N_sign,
            left_cyl_N: formData.left_cyl_N,
            left_axis_N: formData.left_axis_N,
            left_sph_add: formData.left_sph_add,
            left_cyl_add: formData.left_cyl_add,
            left_axis_add: formData.left_axis_add,
            left_sph_cl: formData.left_sph_cl,
            left_cyl_cl: formData.left_cyl_cl,
            left_axis_cl: formData.left_axis_cl,
          },
        }

      },
    ];

    // Log the data to be sent
    console.log("Data to send:", JSON.stringify(dataToSend, null, 2));

    // Sending data to the backend
    try {
      const response = await axios.post(`${API_BASE_URL}/add-new-order`, dataToSend);
      if (response.status === 201) {
        Swal.fire({
          title: "Success!",
          text: "Order created successfully",
          icon: "success",
          confirmButtonText: "OK",
        });
        navigate("/new-order"); // Redirect to orders page or any other page
      } else {
        Swal.fire({
          title: "Error!",
          text: "Failed to create order",
          icon: "error",
          confirmButtonText: "OK",
        });
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      Swal.fire({
        title: "Error!",
        text: "Failed to create order",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  // Static arrays for dropdown options
  const frameTypes = [
    "3 PIECE/RIMLESS",
    "HALF RIMLESS/SUPRA",
    "FULL METAL",
    "FULL SHELL/PLASTIC",
    "GOGGLES(With Power)",
  ];
  const lensForOptions = ["DISTANCE", "NEAR", "BIFOCAL", "PROGRESSIVE"];
  const lensTypes = [
    "MINERAL LENS",
    "PLASTIC LENS",
    "POLYCARBONATE LENS",
    "TRIVEX LENS",
    "ORGANIC LENS",
  ];

  const getCustomers = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/customers`);
      setCustomers(response.data);
    } catch (error) {
      console.error("Error fetching customers:", error);
    }
  };

  const getDoctors = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/doctors`);
      // console.log("Fetched doctors:", response.data); // Log the fetched doctor data
      setDoctors(response.data);
    } catch (error) {
      console.error("Error fetching doctors:", error);
    }
  };

  const handleCustomerChange = (selectedOption) => {
    if (selectedOption) {
      const customer = customers.find((c) => c.id === selectedOption.value);
      if (customer) {
        setFormData({
          ...formData,
          firstname: customer.firstname || "",
          lastname: customer.lastname || "",
          age: customer.age || "",
          gender: customer.gender || "",
          address: customer.address || "",
          mobile: customer.mobile || "",
        });
      }
    } else {
      // Clear fields if no customer is selected
      setFormData({
        ...formData,
        firstname: "",
        lastname: "",
        age: "",
        gender: "",
        address: "",
        mobile: "",
      });
    }
  };

  const handleDoctorChange = (selectedOption) => {
    if (selectedOption) {
      const doctor = doctors.find((d) => d.id === selectedOption.value);
      if (doctor) {
        setFormData({
          ...formData,
          doctor_name: doctor.name || "",
          hospital: doctor.clinic_name || "",
          doctor_city: doctor.city || "",
        });
      }
    } else {
      // Clear fields if no doctor is selected
      setFormData({
        ...formData,
        doctor_name: "",
        hospital: "",
        doctor_city: "",
      });
    }
  };

  // Prepare options for react-select
  const customerOptions = customers.map((customer) => ({
    value: customer.id,
    label: `${customer.firstname} ${customer.lastname}`,
  }));

  const doctorOptions = doctors.map((doctor) => ({
    value: doctor.id,
    label: doctor.name, // Assuming doctor object has a 'name' property
  }));

  const frameStocks = async () => {
    const frames = await axios.get(`${API_BASE_URL}/stocks`);
    setframestock(frames.data);
  };
  const [allLens, setAllLens] = useState([]);
  // New function to fetch lens data
  const fetchLensData = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/lenses`);
      const data = response.data;

      // console.log("Fetched lens data:", data); // Log the fetched lens data

      // Check if data is an array
      setAllLens(data.data);
    } catch (error) {
      console.error("Error fetching lens data:", error);
      setAllLens([]); // Set to empty array on error
    }
  };

  const [lensPricing, setlenPricing] = useState(0);

  const ChoosenLens = async (e) => {
    const selectedLensId = e.target.value; // Get the selected lens ID
    try {
      const response = await axios.get(
        `${API_BASE_URL}/lenses/${selectedLensId}`
      ); // Fetch lens details
      const choosenLensDetails = response.data; // Assuming the response structure is correct

      // Check if details are available
      if (
        choosenLensDetails.success &&
        choosenLensDetails.data.details.length > 0
      ) {
        const lensDetail = choosenLensDetails.data.details[0]; // Get the first lens detail
        setLensData((prev) => ({
          ...prev,
          lensCompanyName: lensDetail.lens_company_name,
          lensProductName: lensDetail.lens_product_name,
          lensPrice: lensDetail.sales_price, // Set the lens price
        }));
        setlenPricing(lensDetail.sales_price); // Update the lens pricing state
      } else {
        console.error("Lens details not found");
      }
    } catch (error) {
      console.error("Error fetching lens data:", error);
    }
  };

  // Function to calculate total price
  const calculateTotalPrice = () => {
    const framePrice = parseFloat(frameDetails.purchase_price) || 0; // Ensure frame price is a number
    const lensPrice = parseFloat(lensData.lensPrice) || 0; // Ensure lens price is a number
    setBillable(framePrice + lensPrice); // Update total price
  };

  // Call calculateTotalPrice when frameDetails or lensData changes
  useEffect(() => {
    calculateTotalPrice();
  }, [frameDetails, lensData, lensPricing]);

  // Call fetchLensData in useEffect
  useEffect(() => {
    getCustomers();
    getDoctors();
    frameStocks();
    fetchLensData(); // Fetch lens data on component mount
  }, []);

  const handleFrameChange = async (e) => {
    const selectedId = e.target.value;
    try {
      const response = await axios.get(`${API_BASE_URL}/stocks/${selectedId}`);
      const data = response.data;
      setFrameDetails(data);

      // Update formData
      setFormData((prev) => ({
        ...prev,
        specs: {
          ...prev.specs,
          specsframeType: data.frame_type,
          specsframeModelName: data.model_name,
          specsframeModelCode: data.model_code,
          specsframeModelColor: data.model_color,
          specsframeSize: data.model_size,
          specsframePrice: data.purchase_price,
        },
        frame: {
          ...prev.frame,
          frameType: data.frame_type,
          frameModelName: data.model_name,
          frameModelCode: data.model_code,
          frameModelColor: data.model_color,
          frameSize: data.model_size,
          framePrice: data.purchase_price,
        },
        lens: {
          ...prev.lens,
          lensType: data.frame_type,
          lensCompanyName: data.model_name,
          lensProductName: data.model_code,
          lensdia: data.model_size,
          lensindex: data.purchase_price,
          lensPrice: data.purchase_price,
        },
      }));
    } catch (error) {
      console.error("Error fetching stock data:", error);
    }
  };

  const calculateTotalBill = () => {
    const framePrice = parseFloat(formData.specs.specsframePrice) || 0; // Ensure frame price is a number
    const lensPrice = parseFloat(formData.lens.lensPrice) || 0; // Ensure lens price is a number
    // console.log("Frame Price:", framePrice, "Lens Price:", lensPrice); // Log prices
    const total = framePrice + lensPrice; // Calculate total
    // console.log("Calculated Total Bill:", total); // Log calculated total
    // setFormData((prev) => ({
    //   ...prev,
    //   specs: { ...prev.specs, specsframePrice: total.toFixed(2) },
    // })); // Update totalBill in formData
    setFormData((prev) => ({ ...prev, totalBill: total.toFixed(2) })); // Update totalBill in formData
  };

  // // Call this function at appropriate times, such as in useEffect or on input change
  // useEffect(() => {
  //   calculateTotalBill();
  // }, [framePrice]); // Recalculate when prices change

  return (
    <>
      <Navbar />
      <div className="h-full w-full bg-gray-200 rounded-lg  md:p-12">
        {showButton && <HomeButton />}
        <h2 className="text-3xl my-5 font-semibold mb-6 text-center text-gray-800">
          New Order
        </h2>

        <form onSubmit={handleSubmit} className="md:space-y-">
          {/* Order Information Section */}
          <div className="p-6 rounded-xl bg-white  border border-gray-200">
            <h3 className="text-2xl font-bold text-gray-800">
              Order Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="order_taken_date"
                  className="block text-sm font-medium text-gray-600"
                >
                  Order Taking Date
                </label>
                <InputField
                  id="order_taken_date"
                  name="order_taken_date"
                  type="date"
                  value={formData.order_taken_date}
                  onChange={handleChange}
                  required
                  className="w-full mt-2 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
              <div>
                <label
                  htmlFor="estimate_completion_date"
                  className="block text-sm font-medium text-gray-600"
                >
                  Expected Completion Date
                </label>
                <InputField
                  id="estimate_completion_date"
                  name="estimate_completion_date"
                  type="date"
                  value={formData.estimate_completion_date}
                  onChange={handleChange}
                  required
                  className="w-full mt-2 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Personal Information Section */}
          {/* Personal Information */}
          <section className="p-6 my-10 bg-white shadow-md rounded-lg border border-gray-200">
            <header className="mb-6">
              <h2 className="text-3xl font-semibold text-gray-800 border-b pb-3">
                Personal Information
              </h2>
            </header>
            <label
              htmlFor="existingCustomer"
              className="block text-sm font-medium text-gray-700 mb-3"
            >
              Select Existing Customer
            </label>
            <Select
              options={customerOptions}
              onChange={handleCustomerChange}
              className="border border-gray-300 rounded focus:ring-2 focus:ring-indigo-500 mb-6"
              placeholder="Select a customer"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputField
                label="First Name"
                name="firstname"
                value={formData.firstname}
                onChange={handleChange}
                required
              />
              <InputField
                label="Last Name"
                name="lastname"
                value={formData.lastname}
                onChange={handleChange}
                required
              />
              <InputField
                label="Age"
                name="age"
                type="number"
                value={formData.age}
                onChange={handleChange}
                required
                min="1"
              />
              <InputField
                label="Gender"
                name="gender"
                type="text"
                value={formData.gender}
                onChange={handleChange}
                required
              />
              <InputField
                label="Address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                required
              />
              <InputField
                label="Mobile Number"
                name="mobile"
                type="tel"
                value={formData.mobile}
                onChange={handleChange}
                required
                pattern="[0-9]{10}"
                title="Please enter a 10-digit phone number"
              />
            </div>
          </section>


          {/* Doctor Details */}
          <div className="container mx-auto p-6">
            {/* Section: Doctor Details */}
            <section className="p-6 my-10 bg-white shadow-md rounded-lg border border-gray-200">
              <header className="mb-6">
                <h2 className="text-3xl font-semibold text-gray-800 border-b pb-3">
                  Doctor Details
                </h2>
              </header>

              {/* Consultation Type */}
              <div className="mb-8">
                <h3 className="text-lg font-medium text-gray-700">Consultation Type</h3>
                <div className="flex space-x-6 mt-4">
                  {[
                    { label: "Doctor", value: "doctor" },
                    { label: "Optician", value: "optician" },
                  ].map((option) => (
                    <label
                      key={option.value}
                      className="flex items-center space-x-3 cursor-pointer"
                    >
                      <input
                        type="radio"
                        name="type"
                        value={option.value}
                        checked={formData.type === option.value}
                        onChange={handleChange}
                        className="focus:ring-indigo-500 h-5 w-5 text-indigo-600 border-gray-300 rounded-full"
                      />
                      <span className="text-gray-700 font-medium">{option.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Conditional Fields */}
              {formData.type === "doctor" ? (
                <div className="space-y-6">
                  <h4 className="text-lg font-semibold text-gray-700">Doctor Information</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Select
                      options={doctorOptions}
                      onChange={handleDoctorChange}
                      className="border border-gray-300 rounded focus:ring-2 focus:ring-indigo-500"
                      placeholder="Select a doctor"
                    />
                    <InputField
                      label="Doctor Name"
                      name="doctor_name"
                      value={formData.doctor_name}
                      onChange={handleChange}
                      required
                    />
                    <InputField
                      label="Hospital"
                      name="hospital"
                      value={formData.hospital}
                      onChange={handleChange}
                      required
                    />
                    <InputField
                      label="City"
                      name="doctor_city"
                      value={formData.doctor_city}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <h4 className="text-lg font-semibold text-gray-700">Optician Information</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label
                        htmlFor="shop_name"
                        className="block text-gray-700 font-medium mb-1"
                      >
                        Shop Name
                      </label>
                      <input
                        type="text"
                        id="shop_name"
                        name="shop_name"
                        value={formData.shop_name}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="Enter Shop Name"
                      />
                    </div>
                    <InputField
                      label="City"
                      name="optician_city"
                      value={formData.optician_city}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
              )}
            </section>
          </div>


          {/* Eye Description */}
          <EyeDescription />

          <div className="my-5 flex flex-col gap-4 md:flex-row md:items-center">
            {[
              { value: "fullSpecs", label: "Full Specs" },
              {
                value: "onlyFrameSunglasses",
                label: "Only Frame / Sunglasses",
              },
              {
                value: "onlyLensContactLens",
                label: "Only Lens / Contact Lens",
              },
            ].map((option) => (
              <label key={option.value} className="flex items-center space-x-3">
                <input
                  type="radio"
                  name="orderDetail"
                  value={option.value}
                  checked={selectedOrderDetails[option.value]}
                  onChange={handleOrderDetailChange}
                  className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                <span>{option.label}</span>
              </label>
            ))}
          </div>

          {/* Conditional rendering for different forms */}
          {selectedOrderDetails.fullSpecs && (
            <div className="md:w-full bg-white p-8 rounded-lg ">
              {/* Full Specs Form */}
              <h3 className="text-xl font-semibold text-gray-700">
                Full Specs Details
              </h3>
              <form className="">
                {/* Buttons: From Stock and Scan QR */}
                <div className="flex justify-end my-6 gap-4">
                  {/* Select Dropdown */}
                  <select
                    name="customer"
                    id="customer"
                    onChange={handleFrameChange} // Hook up your handler here
                    className="border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="" disabled selected>
                      Select Frames
                    </option>
                    {/* Dynamically Render Options */}
                    {framestock &&
                      framestock.map((data, index) => (
                        <option key={index} value={data.id}>
                          {" "}
                          {/* Assuming data.id is the ID */}
                          {data.model_name}
                        </option>
                      ))}
                  </select>

                  {/* Button for Frame Stocks */}

                  {/* Button for QR Scanning */}
                  <button
                    type="button"
                    className="bg-green-500 text-white px-4 py-2 rounded  hover:bg-green-700"
                  >
                    Scan QR
                  </button>
                </div>

                {/* Frame Type */}
                <div className="grid md:grid-cols-3 grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="frameType"
                      className="text-blue-600 font-medium"
                    >
                      Frame Type
                    </label>
                    <input
                      type="text"
                      id="frameType"
                      name="frameType" // Match the formData key
                      value={formData.specs.specsframeType}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          specs: {
                            ...formData.specs,
                            specsframeType: e.target.value,
                          },
                        })
                      }
                      readOnly
                      className="w-full mt-1 border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  {/* Frame Model Name */}
                  <div>
                    <label htmlFor="frameModelName" className="text-gray-500">
                      Frame Model Name
                    </label>
                    <input
                      type="text"
                      id="frameModelName"
                      value={frameDetails.model_name || ""} // Bind to state
                      readOnly
                      className="w-full mt-1 border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  {/* Frame Model Code */}
                  <div>
                    <label htmlFor="frameModelCode" className="text-gray-500">
                      Frame Model Code
                    </label>
                    <input
                      type="text"
                      id="frameModelCode"
                      value={frameDetails.model_code || ""} // Bind to state
                      readOnly
                      className="w-full mt-1 border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  {/* Frame Model Color */}
                  <div>
                    <label htmlFor="frameModelColor" className="text-gray-500">
                      Frame Model Color
                    </label>
                    <input
                      type="text"
                      id="frameModelColor"
                      value={frameDetails.model_color || ""} // Bind to state
                      readOnly
                      className="w-full mt-1 border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  {/* Frame Size and Frame Price */}

                  <div>
                    <label htmlFor="frameSize" className="text-gray-500">
                      Frame Size
                    </label>
                    <input
                      type="text"
                      id="frameSize"
                      value={frameDetails.model_size || ""} // Bind to state
                      readOnly
                      className="w-full mt-1 border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label htmlFor="framePrice" className="text-gray-500">
                      Frame Price
                    </label>
                    <input
                      type="text"
                      id="framePrice"
                      value={frameDetails.purchase_price || ""} // Bind to state
                      readOnly
                      className="w-full mt-1 border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  {/* Lens For */}

                  <select
                    id="lensFor"
                    name="lensFor" // Match the formData key
                    value={formData.specslensFor}
                    onChange={handleChange}
                    className="w-full mt-1 border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option>Select Lens For</option>
                    {lensForOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>

                  {/* Lens Type */}
                  <div>
                    <label
                      htmlFor="lensType"
                      className="text-blue-600 font-medium"
                    >
                      Lens Type
                    </label>
                    <select
                      type="text"
                      id="lensType"
                      name="lensType"
                      value={formData.specslensType}
                      onChange={handleChange}
                      className="w-full mt-1 border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select Lens Type</option>
                      {lensTypes.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Which Side */}
                  <div>
                    <label
                      htmlFor="whichSide"
                      className="text-blue-600 font-medium"
                    >
                      Which Side
                    </label>
                    <select
                      id="whichSide"
                      name="whichSide"
                      value={formData.specswhichSide}
                      onChange={handleChange}
                      className="w-full mt-1 border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select Side</option>
                      <option value="BOTH">BOTH</option>
                      <option value="LEFT">LEFT</option>
                      <option value="RIGHT">RIGHT</option>
                    </select>
                  </div>
                </div>

                {/* Lens Company Name */}
                <div className="grid  grid-cols-2 gap-4 mt-4">
                  <div>
                    <label htmlFor="lensCompanyName" className="text-gray-500">
                      Lens Company Name
                    </label>
                    <input
                      type="text"
                      id="lensCompanyName"
                      name="lensCompanyName"
                      value={formData.specslensCompanyName}
                      onChange={handleChange}
                      placeholder="Enter Company Name"
                      className="w-full mt-1 border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  {/* Lens Product Name */}
                  <div>
                    <label htmlFor="lensProductName" className="text-gray-500">
                      Lens Product Name
                    </label>
                    <select
                      id="lensProductName"
                      name="lensProductName"
                      value={formData.specslensProductName}
                      onChange={(e) => {
                        handleChange(e); // Update form data
                        ChoosenLens(e); // Perform additional logic
                      }}
                      className="w-full mt-1 border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    // onChange={(e) => ChoosenLens(e)} // Call your handleLensChange function
                    >
                      <option value="">Select Lens Product</option>{" "}
                      {/* Default option */}
                      {Array.isArray(allLens) &&
                        allLens.map((data, index) => (
                          <option key={index} value={data.id}>
                            {" "}
                            {/* Use the lens ID as the value */}
                            {data.lens_product_name}{" "}
                            {/* Display company_name and lensProductName */}
                          </option>
                        ))}
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4 mt-4">
                  <div>
                    <label
                      htmlFor="index"
                      className="text-blue-600 font-medium"
                    >
                      Index
                    </label>
                    <input
                      type="text"
                      id="index"
                      name="index"
                      value={formData.specsindex}
                      onChange={handleChange}
                      className="w-full mt-1 border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label htmlFor="dia" className="text-blue-600 font-medium">
                      DIA
                    </label>
                    <input
                      type="text"
                      id="dia"
                      name="dia"
                      value={formData.specsdia}
                      onChange={handleChange}
                      className="w-full mt-1 border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label htmlFor="lensPrice" className="text-gray-500">
                      Lens Price
                    </label>
                    <input
                      type="text"
                      id="lensPrice"
                      // name="lensPrice"
                      // value={formData.specslensPrice} // Bind to formData
                      value={lensPricing || 0}
                      placeholder="Lens Price"
                      className="w-full mt-1 border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </form>
            </div>
          )}
          {selectedOrderDetails.onlyFrameSunglasses && (
            <div>
              {/* Frame Form */}

              <div className="md:w-full bg-white p-8 rounded-lg my-4">
                <h3 className="text-xl font-semibold text-gray-700">
                  Frame Detail
                </h3>
                <div className="flex justify-end my-6 gap-4">
                  <button
                    type="button"
                    className="bg-blue-500 text-white px-4 py-2 rounded  hover:bg-blue-700 "
                  >
                    From Stock
                  </button>
                  <button
                    type="button"
                    className="bg-green-500 text-white px-4 py-2 rounded  hover:bg-green-700 "
                  >
                    Scan QR
                  </button>
                </div>
                {/* Full Specs Form */}

                <form className="">
                  {/* Frame Type */}
                  <div className="grid md:grid-cols-3 grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="frameType"
                        className="text-blue-600 font-medium"
                      >
                        Frame Type
                      </label>
                      <select
                        id="frameType"
                        value={formData.frame.frameType}
                        // onChange={(e) =>
                        //   setFormData({
                        //     ...formData,
                        //     frame: {
                        //       ...formData.frame,
                        //       frameType: e.target.value,
                        //     },
                        //   })
                        // }
                        className="w-full mt-1 border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option>Select Frame Type</option>
                        {frameTypes.map((type) => (
                          <option key={type} value={type}>
                            {type}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Frame Model Name */}
                    <div>
                      <label htmlFor="frameModelName" className="text-gray-500">
                        Model Name
                      </label>
                      <input
                        type="text"
                        id="frameModelName"
                        placeholder="Enter Frame Model Name"
                        value={formData.frame.frameModelName}
                        // onChange={(e) =>
                        //   setFormData({
                        //     ...formData,
                        //     frame: {
                        //       ...formData.frame,
                        //       frameModelName: e.target.value,
                        //     },
                        //   })
                        // }
                        className="w-full mt-1 border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    {/* Frame Model Code */}
                    <div>
                      <label htmlFor="frameModelCode" className="text-gray-500">
                        Model Code
                      </label>
                      <input
                        type="text"
                        id="frameModelCode"
                        placeholder="Enter Frame Model Code"
                        value={formData.frame.frameModelCode}
                        // onChange={(e) =>
                        //   setFormData({
                        //     ...formData,
                        //     frame: {
                        //       ...formData.frame,
                        //       frameModelCode: e.target.value,
                        //     },
                        //   })
                        // }
                        className="w-full mt-1 border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    {/* Frame Model Color */}
                    <div>
                      <label
                        htmlFor="frameModelColor"
                        className="text-gray-500"
                      >
                        Model Color
                      </label>
                      <input
                        type="text"
                        id="frameModelColor"
                        placeholder="Enter Frame Model Color"
                        value={formData.frame.frameModelColor}
                        // onChange={(e) =>
                        //   setFormData({
                        //     ...formData,
                        //     frame: {
                        //       ...formData.frame,
                        //       frameModelColor: e.target.value,
                        //     },
                        //   })
                        // }
                        className="w-full mt-1 border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    {/* Frame Size and Frame Price */}

                    <div>
                      <label htmlFor="frameSize" className="text-gray-500">
                        Model Size
                      </label>
                      <input
                        type="text"
                        id="frameSize"
                        placeholder="Enter Size"
                        value={formData.frame.frameSize}
                        // onChange={(e) =>
                        //   setFormData({
                        //     ...formData,
                        //     frame: {
                        //       ...formData.frame,
                        //       frameSize: e.target.value,
                        //     },
                        //   })
                        // }
                        className="w-full mt-1 border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label htmlFor="framePrice" className="text-gray-500">
                        Price
                      </label>
                      <input
                        type="text"
                        id="framePrice"
                        placeholder="Enter Price"
                        value={formData.frame.framePrice}
                        // onChange={(e) =>
                        //   setFormData({
                        //     ...formData,
                        //     frame: {
                        //       ...formData.frame,
                        //       framePrice: e.target.value,
                        //     },
                        //   })
                        // }
                        className="w-full mt-1 border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </form>
              </div>
            </div>
          )}
          {selectedOrderDetails.onlyLensContactLens && (
            <div>
              {/* Contact Lens Form */}
              <div className="md:w-full bg-white p-8 rounded-lg my-4">
                <h3 className="text-xl font-semibold text-gray-700">
                  Contact Lens Detail
                </h3>
                <form className="">
                  {/* Lens Type */}
                  <div className="grid md:grid-cols-3 grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="lensType"
                        className="text-blue-600 font-medium"
                      >
                        Lens Type
                      </label>
                      <select
                        id="lensType"
                        value={formData.lens.lensType}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            lens: {
                              ...formData.lens,
                              lensType: e.target.value,
                            },
                          })
                        }
                        className="w-full mt-1 border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option>Select Lens Type</option>
                        {lensTypes.map((type) => (
                          <option key={type} value={type}>
                            {type}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Lens Company Name */}
                    <div>
                      <label
                        htmlFor="lensCompanyName"
                        className="text-gray-500"
                      >
                        Company Name
                      </label>
                      <input
                        type="text"
                        id="lensCompanyName"
                        placeholder="Enter Company Name"
                        value={formData.lens.lensCompanyName}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            lens: {
                              ...formData.lens,
                              lensCompanyName: e.target.value,
                            },
                          })
                        }
                        className="w-full mt-1 border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    {/* Lens Product Name */}
                    <div>
                      <label
                        htmlFor="lensProductName"
                        className="text-gray-500"
                      >
                        Product Name
                      </label>
                      <select
                        id="lensProductName"
                        value={formData.lens.lensProductName}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            lens: {
                              ...formData.lens,
                              lensProductName: e.target.value,
                            },
                          })
                        }
                        className="w-full mt-1 border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Select Lens Product</option>
                        {/* {lensData.map((data) => (
                          <option key={data.id} value={data.lens_product_name}>
                            {data.lens_product_name} */}
                        {lensTypes.map((type) => (
                          <option key={type} value={type}>
                            {type}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Index */}
                    <div>
                      <label htmlFor="index" className="text-gray-500">
                        Index
                      </label>
                      <input
                        type="text"
                        id="index"
                        placeholder="Enter Index"
                        value={formData.specs.specsindex}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            specs: {
                              ...formData.specs,
                              specsindex: e.target.value,
                            },
                          })
                        }
                        className="w-full mt-1 border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    {/* DIA */}
                    <div>
                      <label htmlFor="dia" className="text-gray-500">
                        DIA
                      </label>
                      <input
                        type="text"
                        id="dia"
                        placeholder="Enter DIA"
                        value={formData.specs.specsdia}
                        onChange={(e) =>
                          setFormData({ ...formData, dia: e.target.value })
                        }
                        className="w-full mt-1 border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    {/* Lens Price */}
                    <div>
                      <label htmlFor="lensPrice" className="text-gray-500">
                        Price
                      </label>
                      <input
                        type="text"
                        id="lensPrice"
                        placeholder="Enter Price"
                        value={formData.lensPrice}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            lensPrice: e.target.value,
                          })
                        }
                        className="w-full mt-1 border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Billing Section */}
          <section className="mt-10 bg-white p-6 rounded-lg shadow-md border border-gray-200">
            <header className="mb-6">
              <h2 className="text-3xl font-semibold text-gray-800 border-b pb-3">
                Billing Information
              </h2>
            </header>

            {/* Total Amount Section */}
            <div className="flex flex-col items-center md:items-start mb-8">
              <h1 className="text-4xl font-bold text-gray-900">₹{billable.toFixed(2)}</h1>
              <p className="text-base text-gray-600 mt-2">Your total bill amount</p>
            </div>

            {/* Payment Options */}
            <div className="mt-6">
              <label
                htmlFor="paymentType"
                className="block text-lg font-medium text-gray-800"
              >
                Choose Payment Method
              </label>
              <div className="flex items-center mt-4 space-x-4">
                <button
                  type="button"
                  className={`px-5 py-3 rounded-lg border ${paymentType === "complete"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-800 hover:bg-blue-100"
                    }`}
                  onClick={() => handlePaymentSelection("complete")}
                >
                  Complete Payment
                </button>
                <button
                  type="button"
                  className={`px-5 py-3 rounded-lg border ${paymentType === "advanced"
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
              <button onClick={handleSubmit} className="bg-blue-600 p-2 text-white rounded-lg mt-2 w-full">Submit</button>
            </div>
          </section>
        </form>
      </div>
    </>
  );
};

export default NewOrder;
