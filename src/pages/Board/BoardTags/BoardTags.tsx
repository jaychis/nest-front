import React, { useEffect, useState } from 'react';
import DeleteButton from '../../../components/Buttons/DeleteButton';
import styled from 'styled-components';
import { useCommunity } from '../../../contexts/CommunityContext';
import { TagListAPI } from '../../api/tagApi';

const BoardTags = () => {
  const { topics, setTopics } = useCommunity();
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);

  const handleAddTopic = (topic: string) => {
    const formattedTopic = topic.startsWith('#') ? topic : `#${topic}`;
    if (topics.length < 3 && !topics.includes(formattedTopic)) {
      setTopics([...topics, formattedTopic]);
      setSearchTerm('');
    }
  };

  useEffect(() => {
    console.log('topics : ', topics);
    console.log('searchTerm : ', searchTerm);
  }, [topics, searchTerm]);

  const handleRemoveTopic = (index: number) => {
    const newTopics = topics.filter((_, i) => i !== index);
    setTopics(newTopics);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  useEffect(() => {
    if (searchTerm) {
      TagListAPI()
        .then((res) => {
          if (!res) return;
          interface TagListReturnType {
            readonly id: string;
            readonly name: string;
          }
          console.log('TagListAPI response:', res.data);
          const response: TagListReturnType[] = res.data.response;

          const tagNameList: string[] = response.map(
            (el: TagListReturnType) => el.name,
          );
          console.log('tagNameList:', tagNameList);

          const filteredTopics = tagNameList.filter((topic: string) =>
            topic.toLowerCase().includes(searchTerm.toLowerCase()),
          );
          setSuggestions(filteredTopics);
        })
        .catch((err) => console.log('TagListAPI error:', err));
    } else {
      setSuggestions([]);
    }
  }, [searchTerm]);

  return (
    <Container>
      <Form onSubmit={(e) => e.preventDefault()}>
        <div style={{ marginBottom: '20px' }}>
          <Label htmlFor="topicSearch">태그 검색</Label>
          <TopicSearchInput
            type="text"
            id="topicSearch"
            value={searchTerm}
            onChange={handleSearchChange}
          />
          {suggestions.length > 0 && (
            <Suggestions>
              {suggestions.map((suggestion, index) => (
                <Suggestion
                  key={index}
                  onClick={() => handleAddTopic(suggestion)}
                >
                  {suggestion}
                </Suggestion>
              ))}
            </Suggestions>
          )}
          {searchTerm && suggestions.length === 0 && (
            <NoSuggestionWrapper>
              <p>
                등록된 태그가 없습니다. "{searchTerm}"로 새 태그를 추가할 수
                있습니다.
              </p>
              <AddButton onClick={() => handleAddTopic(searchTerm)}>
                "{searchTerm}" 추가
              </AddButton>
            </NoSuggestionWrapper>
          )}
        </div>
        <SelectedTopicWrapper>
          {topics.map((topic, index) => {
            return (
              <TopicItem key={index}>
                <TopicText>{topic}</TopicText>
                <DeleteButton onClick={() => handleRemoveTopic(index)} />
              </TopicItem>
            );
          })}
        </SelectedTopicWrapper>
      </Form>
    </Container>
  );
};

const Container = styled.div`
  background-color: #ffffff;
  padding: 20px;
  max-width: 1180px;
  height: auto;
  margin: 45px auto 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  border-radius: 8px;
  border: 1px solid #ededed;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
`;
const SelectedTopicWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
`;
const TopicItem = styled.div`
  display: flex;
  align-items: center;
  background-color: #f0f0f0;
  border-radius: 20px;
  padding: 8px 12px;
`;
const TopicText = styled.span`
  font-size: 14px;
  margin-right: 10px;
`;
const Label = styled.label`
  margin-bottom: 8px;
  font-size: 14px;
  color: #555;
  font-weight: bold;
`;
const TopicSearchInput = styled.input`
  width: 100%;
  padding: 10px;
  border-radius: 12px;
  border: 1px solid #ccc;
  font-size: 14px;
  background-color: #f7f7f7;
  box-sizing: border-box;
`;
const Suggestions = styled.ul`
  list-style-type: none;
  padding: 0;
  margin-top: 10px;
  border: 1px solid #ccc;
  border-radius: 8px;
  background-color: #fff;
`;
const Suggestion = styled.li`
  padding: 10px;
  cursor: pointer;
`;
const NoSuggestionWrapper = styled.div`
  margin-top: 10px;
  padding: 10px;
  background-color: #f8f8f8;
  border: 1px solid #ccc;
  border-radius: 8px;
  text-align: center;
`;
const AddButton = styled.button`
  margin-top: 10px;
  padding: 10px 10px;
  border: none;
  border-radius: 8px;
  background-color: #0079d3;
  color: white;
  cursor: pointer;
  font-size: 14px;
  font-weight: bold;
  transition: background-color 0.3s ease;
`;
export default BoardTags;
