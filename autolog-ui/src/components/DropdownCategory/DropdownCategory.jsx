
import './DropdownCategory.css';

import { useContext, useEffect, useRef, useState } from 'react';
import _ from 'lodash';
import { motion, AnimatePresence } from 'framer-motion';

import searchIcon from '../../assets/search.png'

import InventoryContext from '../../contexts/inventory';
import DropdownOverlay from '../DropdownOverlay/DropdownOverlay';
import DropdownCategoryItem from './DropdownCategoryItem';
import ModalCreateCategory from '../ModalCreateCategory/ModalCreateCategory';
import apiClient from '../../services/apiClient';
import Loading from '../Loading/Loading';

/**
 * Dropdown for category
 * which user can input words, search by all the categories
 * saved in the inventory and select it in a handy way
 */
export default function DropdownCategory({categoryValue, setCategoryValue}) {
    // get inventory context in order to add/get towards an inventory
    const { selectedInventoryContext } = useContext(InventoryContext);
    const [selectedInventory, setSelectedInventory] = selectedInventoryContext;

    const [isFetching, setIsFetching] = useState(false);
    const [dropdownError, setDropdownError] = useState();
    const [categories, setCategories] = useState([]);

    const [isFocused, setIsFocused] = useState(false);
    const inputRef = useRef(null);

    // manage dropdown states
    const openDropdown = () => setIsFocused(true);
    const closeDropdown = () => setIsFocused(false);

    // modal hook
    const [modalOpen, setModalOpen] = useState(false);

    // manage modal states
    const closeModal = () => setModalOpen(false);
    const openModal = () => setModalOpen(true);

    // handle dropdown item's clicks
    const handleDropdownClick = (value) => {
        setCategoryValue(value)
        closeDropdown();
    }

    // handle on create category button
    const handleOnCreateCategory = () => {
        openModal();
    }

    // fetch list on mount
    useEffect(() => {
        const fetchCategories = async () => {
            setIsFetching(true);

            const { data, error } = await apiClient.getCategories(selectedInventory?.inventoryId);

            if (error) {
                setDropdownError(error);
                console.error("Fetching category error: ", error);
            }

            if (data?.categories) {
                setCategories(data.categories);
            }
            setIsFetching(false);
        }

        // check if user has a selected inventory before fetching
        if (selectedInventory?.inventoryId) {
            fetchCategories();
        }
    }, [isFocused]);

    // on every render, check if input is focused
    if (document.activeElement === inputRef.current) {
        // prevent loops & make sure dropdown is open when input is focused
        if (!isFocused) openDropdown();
    }

    return (
        <div className='dropdown-category'>
            <label htmlFor={'category'}>Category</label>
            <div className={`dropdown-category-wrapper ${isFocused ? 'active' : ''}`}>
                {/* 
                    Header 
                */}
                <input
                    style={{ backgroundImage: searchIcon }}
                    ref={inputRef}
                    tabIndex={0}
                    role="button"
                    name='category'
                    onClick={() => {
                        if (!isFocused) openDropdown();
                    }}
                    value={categoryValue || ''}
                    onChange={(e) => { setCategoryValue(e.target.value) }}
                    className={`dropdown-category-header ${isFocused ? 'active' : ''}`}
                />

                {/* 
                    Inventory List 
                */}
                {isFocused && (
                    <>
                        <DropdownOverlay onClick={closeDropdown} />
                        <div className="dropdown-category-list">
                            {/* if fetching, show loading message */}
                            {isFetching ?
                                <div className="spinning-loader-container">
                                    <div className="spinning-loader"></div>
                                </div>
                                :
                                <>
                                    <DropdownCategoryItem className={'create'} categoryName={"Create new category"} onClick={handleOnCreateCategory} />
                                    {categories?.map((item, idx) => {
                                        // if input has a value, get only items that includes
                                        if (categoryValue !== '') {
                                            if (_.toLower(item?.categoryName).includes(_.toLower(categoryValue))) {
                                                return <DropdownCategoryItem key={idx} categoryName={_.upperCase(item.categoryName)} onClick={handleDropdownClick} />
                                            }
                                        } else {
                                            // return everything
                                            return <DropdownCategoryItem key={idx} categoryName={_.upperCase(item.categoryName)} onClick={handleDropdownClick} />
                                        }
                                    })}
                                </>
                            }
                        </div>
                    </>
                )}

                {/* 
                    Modal for new category
                */}

                <AnimatePresence
                    initial={false}
                    exitBeforeEnter={true}
                    onExitComplete={() => null}>
                    {
                        modalOpen &&
                        <ModalCreateCategory closeModal={closeModal} setCategory={setCategoryValue} />
                    }
                </AnimatePresence>
            </div>
        </div>
    )
}
