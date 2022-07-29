import _ from "lodash"

function DropdownCategoryItem({categoryName, onClick, className}) {
    return (
        <div key={categoryName} className={`dropdown-category-item ${className || ''}`} onClick={() => onClick(_.capitalize(categoryName))}>
            <span>{_.capitalize(categoryName)}</span>
        </div>
    )
}

export default DropdownCategoryItem