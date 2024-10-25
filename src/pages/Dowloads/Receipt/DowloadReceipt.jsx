import Layout from "../../../layout/Layout";
import PageTitle from "../../../components/common/PageTitle";
import Dropdown from "../../../components/common/DropDown";
import { Button, Input, Card } from "@material-tailwind/react";
import Moment from "moment";
import { useState, useEffect } from "react";
import BASE_URL from "../../../base/BaseUrl";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

function DowloadRecpit() {
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  const exemption = [
    {
      value: "80G",
      label: "80G",
    },
    {
      value: "Non 80G",
      label: "Non 80G",
    },
    {
      value: "FCRA",
      label: "FCRA",
    },
  ];

  const donation_type = [
    {
      value: "One Teacher School",
      label: "One Teacher School",
    },
    {
      value: "General",
      label: "General",
    },
    {
      value: "Membership",
      label: "Membership",
    },
  ];

  // Get the first and last date
  const todayback = Moment().format("YYYY-MM-DD");
  const firstdate = Moment().startOf("month").format("YYYY-MM-DD");

  const [receiptsdwn, setReceiptDownload] = useState({
    receipt_from_date: firstdate,
    receipt_to_date: todayback,
    receipt_donation_type: "",
    receipt_exemption_type: "",
    indicomp_source: "",
  });

  // Input change handler for native inputs
  const onInputChange = (name, value) => {
    setReceiptDownload({
      ...receiptsdwn,
      [name]: value,
    });
  };

  // Submit handler for download
  const onSubmit = (e) => {
    e.preventDefault();
    let data = {
      receipt_from_date: receiptsdwn.receipt_from_date,
      receipt_to_date: receiptsdwn.receipt_to_date,
      receipt_donation_type: receiptsdwn.receipt_donation_type,
      receipt_exemption_type: receiptsdwn.receipt_exemption_type,
      indicomp_source: receiptsdwn.indicomp_source,
    };

    if (document.getElementById("dowRecp").reportValidity()) {
      setIsButtonDisabled(true);

      axios({
        url: BASE_URL + "/api/download-receipt",
        method: "POST",
        data,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
        .then((res) => {
          const url = window.URL.createObjectURL(new Blob([res.data]));
          const link = document.createElement("a");
          link.href = url;
          link.setAttribute("download", "receipt_list.csv");
          document.body.appendChild(link);
          link.click();
          toast.success("Receipt is Downloaded Successfully");
          setReceiptDownload("");
        })
        .catch((err) => {
          toast.error("Receipt is Not Downloaded");
          console.error("Download error:", err.response);
        })
        .finally(() => {
          setIsButtonDisabled(false);
        });
    }
  };

  // Fetch item data
  const [datasource, setDatasource] = useState([]);
  useEffect(() => {
    const requestOptions = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    };

    fetch(BASE_URL + "/api/fetch-datasource", requestOptions)
      .then((response) => response.json())
      .then((data) => setDatasource(data.datasource));
  }, []);

  return (
    <Layout>
      <div className="mt-4 mb-6">
        <PageTitle title={"Download Receipts"} />
      </div>
      <Card className="p-4">
        <h3 className="text-red-500 mb-5">
          Leave blank if you want all records.
        </h3>

        <form id="dowRecp" autoComplete="off">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            <div className="w-full">
              <Input
                required
                type="date"
                label="From Date"
                name="receipt_from_date"
                className="required"
                value={receiptsdwn.receipt_from_date}
                onChange={(e) => onInputChange(e)}
              />
            </div>
            <div className="w-full">
              <Input
                required
                type="date"
                label="To Date"
                className="required"
                name="receipt_to_date"
                value={receiptsdwn.receipt_to_date}
                onChange={(e) => onInputChange(e)}
              />
            </div>
            <div className="w-full">
              <Dropdown
                label="Purpose"
                className="required"
                name="receipt_donation_type"
                value={receiptsdwn.receipt_donation_type}
                options={donation_type.map((item) => ({
                  value: item.value,
                  label: item.label,
                }))}
                onChange={(value) =>
                  onInputChange("receipt_donation_type", value)
                }
              />
            </div>

            <div className="w-full">
              <Dropdown
                label="Category"
                className="required"
                name="receipt_exemption_type"
                value={receiptsdwn.receipt_exemption_type}
                options={exemption.map((option) => ({
                  value: option.value,
                  label: option.label,
                }))}
                onChange={(value) =>
                  onInputChange("receipt_exemption_type", value)
                }
              />
            </div>

            <div className="w-full">
              <Dropdown
                label="Source"
                className="required"
                name="indicomp_source"
                value={receiptsdwn.indicomp_source}
                options={datasource.map((option) => ({
                  value: option.data_source_type,
                  label: option.data_source_type,
                }))}
                onChange={(value) => onInputChange("indicomp_source", value)}
              />
            </div>

            <div className="w-77">
              <Button
                color="blue"
                fullWidth
                onClick={onSubmit}
                disabled={isButtonDisabled}
              >
                {isButtonDisabled ? "Downloading..." : "Download"}
              </Button>
            </div>
          </div>
        </form>
      </Card>
    </Layout>
  );
}

export default DowloadRecpit;