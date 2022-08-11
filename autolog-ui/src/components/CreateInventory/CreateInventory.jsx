import * as React from "react";
import "./CreateInventory.css";
import RedCar from "../../assets/red-car.png";

import InventoriesContext from "../../contexts/inventories";
import { useContext } from "react";
import { Navigate, useNavigate } from "react-router";
import Form from "../Form/Form";
import ButtonAction from "../Button/ButtonAction";

export default function CreateInventory() {
  const navigate = useNavigate();
  const [field, setField] = React.useState({ name: "", password: "" });
  const { inventoryPostContext, errorContext, accessibleInventoriesContext } = useContext(InventoriesContext);
  const [accessibleInventories, setAccessibleInventories] = accessibleInventoriesContext;
  const [error, setError] = errorContext;
  const [createInventory] = inventoryPostContext;

  // new inventory form
  const formArrayCreateInventory = [
    {
      label: "Inventory Name",
      name: "name",
      type: "text",
      placeholder: "This is a placeholder",
    },
    {
      label: "Company Name",
      name: "companyName",
      type: "text",
      placeholder: "Pollos Hermanos",
    },
    {
      label: "Company Email",
      name: "companyEmail",
      type: "text",
      placeholder: "Pollos Hermanos",
    },
    {
      label: "Company Address",
      name: "companyAddress",
      type: "text",
      placeholder: "1234 NW 5th St",
    },
    {
      label: "Company Phone",
      name: "companyPhone",
      type: "text",
      placeholder: "(123) 456-7890",
    },
  ];

  const handleOnFormChange = (e) => {
    let name = e.target.name;
    let value = e.target.value;

    // Change the value of the given field
    setField({ ...field, [name]: value });
  };

  const handleCreateInventory = async () => {
    await createInventory(field);
    navigate("/dashboard");
    /// Add code for onclick to create inventory
  };

  if(accessibleInventories.length > 0) {
    navigate('/dashboard');
  }

  return (

    <div className="create-inventory-page">
      <div className="content">
        <h1 className="header-instruction"> Create a new inventory! </h1>
        <div className="create-inventory-form">
          <Form
            formState={field}
            setFormState={setField}
            formArray={formArrayCreateInventory}
          />
        </div>
        <div className="button-container">
        <ButtonAction
          color={"var(--actionBlueAccent)"}
          onClick={handleCreateInventory}
          label={"Create Inventory"}
        />
        </div>
      </div>
    </div>
  );
}
