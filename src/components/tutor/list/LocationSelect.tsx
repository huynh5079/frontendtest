import { useEffect, useState, type FC } from "react";
import axios from "axios";

interface Province {
    code: number;
    name: string;
}

interface District {
    code: number;
    name: string;
}

interface Ward {
    code: number;
    name: string;
}

const TutorLocationSelector: FC = () => {
    const [provinces, setProvinces] = useState<Province[]>([]);
    const [districts, setDistricts] = useState<District[]>([]);
    const [wards, setWards] = useState<Ward[]>([]);

    const [selectedProvince, setSelectedProvince] = useState<number | null>(null);
    const [selectedDistrict, setSelectedDistrict] = useState<number | null>(null);
    const [selectedWard, setSelectedWard] = useState<number | null>(null);

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

    return (
        <div className="location-selector">

            {/* Chọn tỉnh */}
            <div className="form-group">
                <p>Tỉnh / Thành phố</p>
                <select
                    value={selectedProvince ?? ""}
                    onChange={(e) => setSelectedProvince(Number(e.target.value))}
                >
                    <option value="">-- Chọn Tỉnh / Thành phố --</option>
                    {provinces.map((p) => (
                        <option key={p.code} value={p.code}>
                            {p.name}
                        </option>
                    ))}
                </select>
            </div>

            {/* Chọn quận - chỉ hiển thị khi đã chọn tỉnh */}
            {selectedProvince && (
                <div className="form-group">
                    <p>Quận / Huyện</p>
                    <select
                        value={selectedDistrict ?? ""}
                        onChange={(e) => setSelectedDistrict(Number(e.target.value))}
                    >
                        <option value="">-- Chọn Quận / Huyện --</option>
                        {districts.map((d) => (
                            <option key={d.code} value={d.code}>
                                {d.name}
                            </option>
                        ))}
                    </select>
                </div>
            )}

            {/* Chọn phường - chỉ hiển thị khi đã chọn quận */}
            {selectedDistrict && (
                <div className="form-group">
                    <p>Phường / Xã</p>
                    <select
                        value={selectedWard ?? ""}
                        onChange={(e) => setSelectedWard(Number(e.target.value))}
                    >
                        <option value="">-- Chọn Phường / Xã --</option>
                        {wards.map((w) => (
                            <option key={w.code} value={w.code}>
                                {w.name}
                            </option>
                        ))}
                    </select>
                </div>
            )}
        </div>
    );
};

export default TutorLocationSelector;
