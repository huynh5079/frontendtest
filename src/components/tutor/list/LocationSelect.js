import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import axios from "axios";
const TutorLocationSelector = () => {
    const [provinces, setProvinces] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [wards, setWards] = useState([]);
    const [selectedProvince, setSelectedProvince] = useState(null);
    const [selectedDistrict, setSelectedDistrict] = useState(null);
    const [selectedWard, setSelectedWard] = useState(null);
    // Lấy danh sách tỉnh/thành phố
    useEffect(() => {
        axios
            .get("https://provinces.open-api.vn/api/p/")
            .then((res) => setProvinces(res.data))
            .catch((err) => console.error(err));
    }, []);
    // Khi chọn tỉnh -> load quận/huyện
    useEffect(() => {
        if (selectedProvince) {
            axios
                .get(`https://provinces.open-api.vn/api/p/${selectedProvince}?depth=2`)
                .then((res) => setDistricts(res.data.districts))
                .catch((err) => console.error(err));
            setWards([]);
            setSelectedDistrict(null);
            setSelectedWard(null);
        }
    }, [selectedProvince]);
    // Khi chọn quận -> load phường/xã
    useEffect(() => {
        if (selectedDistrict) {
            axios
                .get(`https://provinces.open-api.vn/api/d/${selectedDistrict}?depth=2`)
                .then((res) => setWards(res.data.wards))
                .catch((err) => console.error(err));
            setSelectedWard(null);
        }
    }, [selectedDistrict]);
    return (_jsxs("div", { className: "location-selector", children: [_jsxs("div", { className: "form-group", children: [_jsx("p", { children: "T\u1EC9nh / Th\u00E0nh ph\u1ED1" }), _jsxs("select", { value: selectedProvince ?? "", onChange: (e) => setSelectedProvince(Number(e.target.value)), children: [_jsx("option", { value: "", children: "-- Ch\u1ECDn T\u1EC9nh / Th\u00E0nh ph\u1ED1 --" }), provinces.map((p) => (_jsx("option", { value: p.code, children: p.name }, p.code)))] })] }), selectedProvince && (_jsxs("div", { className: "form-group", children: [_jsx("p", { children: "Qu\u1EADn / Huy\u1EC7n" }), _jsxs("select", { value: selectedDistrict ?? "", onChange: (e) => setSelectedDistrict(Number(e.target.value)), children: [_jsx("option", { value: "", children: "-- Ch\u1ECDn Qu\u1EADn / Huy\u1EC7n --" }), districts.map((d) => (_jsx("option", { value: d.code, children: d.name }, d.code)))] })] })), selectedDistrict && (_jsxs("div", { className: "form-group", children: [_jsx("p", { children: "Ph\u01B0\u1EDDng / X\u00E3" }), _jsxs("select", { value: selectedWard ?? "", onChange: (e) => setSelectedWard(Number(e.target.value)), children: [_jsx("option", { value: "", children: "-- Ch\u1ECDn Ph\u01B0\u1EDDng / X\u00E3 --" }), wards.map((w) => (_jsx("option", { value: w.code, children: w.name }, w.code)))] })] }))] }));
};
export default TutorLocationSelector;
