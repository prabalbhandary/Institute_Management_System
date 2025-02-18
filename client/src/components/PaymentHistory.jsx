import React, { useEffect, useState } from "react";
import "./style.css";
import axios from "axios";
import { toast } from "react-toastify";
import Loader from "./Loader";

const PaymentHistory = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [paymentList, setPaymentList] = useState([]);
  useEffect(() => {
    getPaymentHistory();
  }, []);
  const getPaymentHistory = () => {
    setIsLoading(true);
    axios
      .get(`https://institute-management-system.onrender.com/api/v1/fees/payment-history`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then((res) => {
        setIsLoading(false);
        setPaymentList(res.data.paymentHistory.reverse());
        toast.success(res.data.message);
      })
      .catch((error) => {
        setIsLoading(false);
        toast.error(error.response.data.message);
      });
  };
  return isLoading ? (
    <Loader />
  ) : (
    <>
      <div className="payment-history-wrapper">
        <table>
          <thead>
            <tr>
              <th>Full Name</th>
              <th>Date & Time</th>
              <th>Amount</th>
              <th>Remark</th>
            </tr>
          </thead>
          <tbody>
            {paymentList &&
              paymentList.length > 0 &&
              paymentList.map((payment) => (
                <tr key={payment._id}>
                  <td>{payment.fullName}</td>
                  <td>{payment.createdAt}</td>
                  <td>{payment.amount}</td>
                  <td>{payment.remark}</td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default PaymentHistory;
