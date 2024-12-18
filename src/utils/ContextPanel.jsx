import { createContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import BASE_URL from "../base/BaseUrl";
import axios from "axios";

export const ContextPanel = createContext();

const AppProvider = ({ children }) => {
  const [isPanelUp, setIsPanelUp] = useState(true);

  const [error, setError] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const checkPanelStatus = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/check-status`);
      const datas = await response.data;
      setIsPanelUp(datas);
      if (datas?.success) {
        setError(false);
      } else {
        setError(true);
      }
    } catch (error) {
      setError(true);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    const currentPath = location.pathname;

    if (error) {
      localStorage.clear();
      navigate("/maintenance");
    } else if (isPanelUp?.success) {
      if (token) {
        const allowedPath = [
          "/home",

          //Chapters

          "/chapters",
          "/add-chapter",
          "/edit-chapter",
          "/view-chapter",
          "/view-school",
          "/edit-datasource",

          // States

          "/states",
          // Designation
          "/designation",
          // Expensive-type
          "/expensive-type",
          // FAQ
          "/faqList",
          // Receipts
          "/receipts",
          "/create-receipts",
          "/view-receipts",
          "/edit-receipts",

          // REPORT

          "/report/donorsummary",
          "/report/recepit",
          "/report/promoter",
          "/report/donation",
          "/report/school",
          "/report/otg",
          "/report/payment",
          "/report/suspense",
          //report view
          "/d-summary-view",
          "/recepit-summary-view",
          "/recepit-otg-view",
          "/recepit-nopan-view",
          "/recepit-group-view",
          "/report/payment-view",
          "/report/donor-view",
          "/report/donorgroup-view",
          "/recepit-donation-view",
          "/report/schoolview",

          //download
          "/download/donor",
          "/download/receipts",
          "/download/school",
          "/material-recepit",
          "/download/team",
          "/download/ots",
          "/download/allreceipts",
          //others
          "/others-faq",
          "/others-team",
          "/others-team-add",
          "/others-notification",
          // Donor

          "/donor-list",
          "/add-indivisual",
          "/add-company",
          "/member-list",
          "/donor-view",
          "/receipt-details",
          "/receipt-list",
          "/donor-edit",
          "/receipt-view",
          "/viewer-list",
          "/add-viewer",
          "/edit-viewer",
          "/duplicate-list",
          //students
          "/students-full-list",
          "/students-to-allot",
          "/students-report-donor",
          "/students-full-list-view",
          "/students-addschoolalot",
          "/students-schoolallot",
          "/students-allotedit",
          "/students-allotview",
          "/students-allotletter",
          "/students/report-donor-allotlist",
          "/donor/duplicate-list",
          "/donor/duplicate-list/edit/:id",
          "/manualguide/book",
          "/form",
          "/profile",
          "/change-password",
        ];

        const isAllowedPath = allowedPath.some((path) =>
          currentPath.startsWith(path)
        );
        if (isAllowedPath) {
          navigate(currentPath + location.search);
          console.log(currentPath + location.search);
        } else {
          navigate("/home");
        }
      } else {
        if (
          currentPath === "/" ||
          currentPath === "/register" ||
          currentPath === "/forget-password" ||
          currentPath === "/sign-up-page"
        ) {
          navigate(currentPath);
        } else {
          navigate("/"); // Redirect to login if no token
        }
      }
    }
  }, [error, navigate, isPanelUp, location.pathname]);

  useEffect(() => {
    checkPanelStatus();
    const intervalId = setInterval(checkPanelStatus, 60000);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <ContextPanel.Provider value={{ isPanelUp, setIsPanelUp }}>
      {children}
    </ContextPanel.Provider>
  );
};

export default AppProvider;
