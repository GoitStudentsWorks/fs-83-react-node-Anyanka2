import {
  Item,
  ContainerPetInfo,
  Image,
  ContainerPetStatus,
  TextStatus,
  ContainerButton,
  Button,
  ListPetInfo,
  ItemPetInfo,
  SpanPetText,
  TextPetName,
  LearnMoreBtn,
  NoticeListWrapper,
} from "./NoticeCard.styled";
import { ReactComponent as HeartIcon } from "../../../assets/icons/heart.svg";
import { ReactComponent as TrashIcon } from "../../../assets/icons/trash.svg";
import { ReactComponent as LocationIcon } from "../../../assets/icons/location.svg";
import { ReactComponent as ClockIcon } from "../../../assets/icons/clock.svg";
import { ReactComponent as FemaleIcon } from "../../../assets/icons/female.svg";
import { ReactComponent as MaleIcon } from "../../../assets/icons/male.svg";
import { theme } from "../../../shared/styles/theme";
import { toast } from "react-toastify";
// import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
// import { infoNotices } from "../../../redux/notices/selectorsNotices.js";
import { useEffect, useState } from "react";
import {
  deleteNotice,
  favoriteNotice,
} from "../../../redux/notices/operationsNotices.js";

import { Loader } from "../../Loader/Loader.jsx";
import Pagination from "../../../shared/components/Pagination/Pagination.jsx";
import UniversalModal from "../../../shared/components/UniversalModal/UniversalModal.jsx";
import { NoticeModalMore } from "../NoticeModals/NoticeModalMore.jsx";
import { selectToken } from "../../../redux/auth/selectors";
import axios from "axios";

import { userInfo } from "../../../redux/auth/selectors.js";
import { getCurrentUser } from "../../../redux/auth/operation.js";

export const NoticeCard = ({ searchKeyword, searchCategory }) => {
  // const isAuthorized = useSelector(selectToken);
  // const [dataAtr, setDataAtr] = useState({ page: 1, items: 12 });
  const [currentPage, setCurrentPage] = useState(1);
  //const [keyword, setKeyword] = useState(searchKeyword);
  const [totalPages, setTotalPages] = useState();
  const [isModal, setIsModal] = useState(false);
  const [noticeId, setNoticeId] = useState();
  const [materials, setMaterials] = useState([]);
  const dispatch = useDispatch();

  const tokenuser = useSelector(selectToken);
  const { _id: idUser } = useSelector(userInfo);
  const [likedItemIds, setLikedItemIds] = useState([]);
  const [isRefresh, setIsRefresh] = useState(false);

  function calculateAgeFromUnixTimestamp(timestamp) {
    const milliseconds = timestamp * 1000; // Преобразование секунд в миллисекунды
    const dob = new Date(milliseconds); // Создание объекта Date из Unix Timestamp

    const today = new Date();

    let age = today.getFullYear() - dob.getFullYear();

    const monthDiff = today.getMonth() - dob.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
      age--;
    }

    return age;
  }
  const heandelRemoveNotice = (owner, noticeId) => {
    if (idUser === owner) {
      dispatch(deleteNotice(noticeId));
      setIsRefresh(true);
    } else {
      toast(
        "You are not authorized to delete this notice or this notice don't your.",
        {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        }
      );
    }
  };

  useEffect(() => {
    const fetchUser = async () => {
      if (!tokenuser) {
        return;
      }
      const res = await dispatch(getCurrentUser());

      const likesUser = res.payload[0].favoriteNotices;
      setLikedItemIds(likesUser);
    };
    fetchUser();
  }, [dispatch, tokenuser]);

  useEffect(() => {
    const getMaterials = async (pageNumber, itemsPerPage = 12) => {
      try {
        const response = await axios.post(`/api/notices`, {
          category:
            searchCategory || searchCategory !== "" ? searchCategory : null,
          keyword:
            searchKeyword || searchKeyword !== ""
              ? searchKeyword.toLowerCase()
              : null,
          page: pageNumber,
          limit: itemsPerPage,
        });

        setMaterials(response.data.notices);
        setTotalPages(response.data.totalPages);
      } catch (error) {
        setMaterials([]);
        setTotalPages(1);
      }
    };
    setIsRefresh(false);
    getMaterials(currentPage, 12);
  }, [currentPage, searchKeyword, searchCategory, isRefresh]);

  const paginationHandler = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleModal = (id) => {
    if (typeof id === "string") {
      setNoticeId(id);
    }

    setIsModal((prev) => !prev);
  };

  const handleLike = async (id) => {
    if (!tokenuser) {
      console.log("не залогінений");
      return;
    }

    const { payload } = await dispatch(favoriteNotice(id));
    setLikedItemIds(payload);
  };

  return (
    <>
      <NoticeListWrapper>
        {materials ? (
          materials.map((notice) => (
            <Item key={notice._id}>
              <ContainerPetInfo>
                <Image src={notice.imageUrl} alt="pet" loading="lazy"></Image>
                <ContainerPetStatus>
                  <TextStatus>{notice.category}</TextStatus>
                  <ContainerButton>
                    <Button
                      aria-label="add to favorites"
                      onClick={() => handleLike(notice._id)}
                    >
                      <HeartIcon
                        width={"24px"}
                        height={"24px"}
                        stroke={
                          likedItemIds.includes(notice._id)
                            ? "none"
                            : theme.colors.blueLink
                        }
                        fill={
                          likedItemIds.includes(notice._id)
                            ? theme.colors.blueLink
                            : "none"
                        }
                      />
                    </Button>

                    {notice.owner === idUser ? (
                      <Button
                        aria-label="delete from favorites"
                        onClick={() =>
                          heandelRemoveNotice(notice.owner, notice._id)
                        }
                      >
                        <TrashIcon
                          width={"24px"}
                          height={"24px"}
                          stroke={theme.colors.blueLink}
                          fill={theme.colors.lightBlue}
                        />
                      </Button>
                    ) : (
                      <></>
                    )}
                  </ContainerButton>
                </ContainerPetStatus>
                <ListPetInfo>
                  <ItemPetInfo>
                    <LocationIcon />
                    <SpanPetText>{notice.location}</SpanPetText>
                  </ItemPetInfo>
                  <ItemPetInfo>
                    <ClockIcon />
                    <SpanPetText>
                      {calculateAgeFromUnixTimestamp(notice.birthday)} year
                    </SpanPetText>
                  </ItemPetInfo>
                  <ItemPetInfo>
                    {notice.sex === "male" ? <MaleIcon /> : <FemaleIcon />}
                    <SpanPetText>{notice.sex}</SpanPetText>
                  </ItemPetInfo>
                </ListPetInfo>
              </ContainerPetInfo>
              <TextPetName>{notice.title}</TextPetName>
              <LearnMoreBtn
                aria-label="show more options"
                onClick={() => handleModal(notice._id)}
              >
                Learn more
              </LearnMoreBtn>
            </Item>
          ))
        ) : (
          <Loader />
        )}
      </NoticeListWrapper>
      {totalPages !== 0 ? (
        <Pagination
          totalPages={totalPages}
          page={currentPage}
          paginationHandler={paginationHandler}
        />
      ) : (
        " "
      )}
      <UniversalModal
        isModalOpen={isModal}
        evt="children"
        onClick={handleModal}
      >
        <NoticeModalMore noticeId={noticeId}/>
      </UniversalModal>
    </>
  );
};
