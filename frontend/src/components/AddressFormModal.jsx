import React, { useState, useEffect } from 'react';

const EMPTY_FORM = {
  fullName: '', phone: '', houseNo: '', street: '',
  landmark: '', city: '', state: '', pincode: '',
  country: '', addressType: 'Home', isDefault: false,
};

const inputCls = 'border border-gray-300 rounded py-1.5 px-3.5 w-full text-sm focus:outline-none focus:border-gray-600';

const AddressFormModal = ({ onClose, onSave, initial = null, isFirst = false }) => {
  const [form, setForm] = useState(EMPTY_FORM);

  useEffect(() => {
    if (initial) setForm({ ...EMPTY_FORM, ...initial });
    else if (isFirst) setForm({ ...EMPTY_FORM, isDefault: true });
  }, [initial, isFirst]);

  const onChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const required = ['fullName', 'phone', 'houseNo', 'street', 'city', 'state', 'pincode', 'country'];
    for (const field of required) {
      if (!form[field]?.trim()) {
        alert(`${field} is required`);
        return;
      }
    }
    if (!/^[0-9]{7,15}$/.test(form.phone.replace(/[\s\-\+\(\)]/g, ''))) {
      alert('Enter a valid phone number');
      return;
    }
    onSave(form);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-lg rounded max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h2 className="font-medium text-lg">{initial ? 'Edit Address' : 'Add New Address'}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-black text-xl leading-none">&times;</button>
        </div>
        <form onSubmit={handleSubmit} className="px-6 py-4 flex flex-col gap-3">
          <input name="fullName" value={form.fullName} onChange={onChange} placeholder="Full Name *" className={inputCls} />
          <input name="phone" value={form.phone} onChange={onChange} placeholder="Phone Number *" className={inputCls} />
          <input name="houseNo" value={form.houseNo} onChange={onChange} placeholder="House No. / Flat No. *" className={inputCls} />
          <input name="street" value={form.street} onChange={onChange} placeholder="Street / Area / Locality *" className={inputCls} />
          <input name="landmark" value={form.landmark} onChange={onChange} placeholder="Landmark (Optional)" className={inputCls} />
          <div className="flex gap-3">
            <input name="city" value={form.city} onChange={onChange} placeholder="City *" className={inputCls} />
            <input name="state" value={form.state} onChange={onChange} placeholder="State *" className={inputCls} />
          </div>
          <div className="flex gap-3">
            <input name="pincode" value={form.pincode} onChange={onChange} placeholder="PIN Code *" className={inputCls} />
            <input name="country" value={form.country} onChange={onChange} placeholder="Country *" className={inputCls} />
          </div>
          <div className="flex gap-3">
            {['Home', 'Work', 'Other'].map(type => (
              <button
                key={type}
                type="button"
                onClick={() => setForm(prev => ({ ...prev, addressType: type }))}
                className={`px-4 py-1.5 text-sm border ${form.addressType === type ? 'bg-black text-white border-black' : 'border-gray-300 text-gray-600'}`}
              >
                {type}
              </button>
            ))}
          </div>
          {!isFirst && (
            <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
              <input type="checkbox" name="isDefault" checked={form.isDefault} onChange={onChange} />
              Set as default address
            </label>
          )}
          <div className="flex gap-3 mt-2">
            <button type="button" onClick={onClose} className="flex-1 border border-gray-300 py-2 text-sm hover:border-gray-600">
              Cancel
            </button>
            <button type="submit" className="flex-1 bg-black text-white py-2 text-sm active:bg-gray-700">
              Save Address
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddressFormModal;
