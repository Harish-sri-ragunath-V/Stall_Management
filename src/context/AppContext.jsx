
import React, { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext();

const getApiUrl = () => {
    let url = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
    // Remove trailing slash if exists, then ensure it ends with /api
    if (url && !url.endsWith('/api')) {
        url = `${url.replace(/\/$/, '')}/api`;
    }
    return url;
};

const API_URL = getApiUrl();

export const AppProvider = ({ children }) => {
    const [dishes, setDishes] = useState([]);
    const [sales, setSales] = useState([]);
    const [investors, setInvestors] = useState([]);
    const [expenses, setExpenses] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        try {
            const [dishesRes, salesRes, investorsRes, expensesRes] = await Promise.all([
                fetch(`${API_URL}/dishes`),
                fetch(`${API_URL}/sales`),
                fetch(`${API_URL}/investors`),
                fetch(`${API_URL}/expenses`)
            ]);

            const dishesData = await dishesRes.json();
            const salesData = await salesRes.json();
            const investorsData = await investorsRes.json();
            const expensesData = await expensesRes.json();

            setDishes(dishesData);
            setSales(salesData);
            setInvestors(investorsData);
            setExpenses(expensesData);
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const addDish = async (dish) => {
        try {
            const res = await fetch(`${API_URL}/dishes`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dish)
            });
            const newDish = await res.json();
            setDishes([...dishes, newDish]);
        } catch (error) {
            console.error("Error adding dish:", error);
        }
    };

    const updateDish = async (id, updatedDish) => {
        try {
            const res = await fetch(`${API_URL}/dishes/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedDish)
            });
            const data = await res.json();
            setDishes(dishes.map(d => d.id === id ? data : d));
        } catch (error) {
            console.error("Error updating dish:", error);
        }
    };

    const removeDish = async (id) => {
        try {
            await fetch(`${API_URL}/dishes/${id}`, { method: 'DELETE' });
            setDishes(dishes.filter(d => d.id !== id));
        } catch (error) {
            console.error("Error deleting dish:", error);
        }
    };

    const addSale = async (saleData) => {
        try {
            const res = await fetch(`${API_URL}/sales`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(saleData)
            });
            const newSale = await res.json();
            setSales([newSale, ...sales]);
        } catch (error) {
            console.error("Error adding sale:", error);
        }
    };

    const addInvestor = async (investor) => {
        try {
            const res = await fetch(`${API_URL}/investors`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(investor)
            });
            const newInvestor = await res.json();
            setInvestors([...investors, newInvestor]);
        } catch (error) {
            console.error("Error adding investor:", error);
        }
    };

    const updateInvestor = async (id, updated) => {
        try {
            const res = await fetch(`${API_URL}/investors/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updated)
            });
            const data = await res.json();
            setInvestors(investors.map(i => i.id === id ? data : i));
        } catch (error) {
            console.error("Error updating investor:", error);
        }
    };

    const removeInvestor = async (id) => {
        try {
            await fetch(`${API_URL}/investors/${id}`, { method: 'DELETE' });
            setInvestors(investors.filter(i => i.id !== id));
        } catch (error) {
            console.error("Error deleting investor:", error);
        }
    };

    const addExpense = async (expense) => {
        try {
            const res = await fetch(`${API_URL}/expenses`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(expense)
            });
            const newExpense = await res.json();
            setExpenses([newExpense, ...expenses]);
        } catch (error) {
            console.error("Error adding expense:", error);
        }
    };

    const removeExpense = async (id) => {
        try {
            await fetch(`${API_URL}/expenses/${id}`, { method: 'DELETE' });
            setExpenses(expenses.filter(e => e.id !== id));
        } catch (error) {
            console.error("Error deleting expense:", error);
        }
    };

    return (
        <AppContext.Provider value={{
            dishes, addDish, updateDish, removeDish,
            sales, addSale,
            investors, addInvestor, updateInvestor, removeInvestor,
            expenses, addExpense, removeExpense,
            loading
        }}>
            {children}
        </AppContext.Provider>
    );
};

export const useApp = () => useContext(AppContext);
