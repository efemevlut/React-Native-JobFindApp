import AsyncStorage from '@react-native-async-storage/async-storage';
import Modal from 'react-native-modal';
import React, {useEffect, useState} from 'react';
import {SafeAreaView, View, Text, FlatList, Button} from 'react-native';
import {WebView} from 'react-native-webview';

import {JobItem} from '../components';
import {jobs, IntroductionStyle} from '../styles';

const SavedJobs = (props) => {
  const [modalFlag, setModalFlag] = useState(false);
  const [jobList, setJobList] = useState([]);
  const [selectedJob, setSelectedJob] = useState('');

  function removeJob() {
    const newArray = [...jobList];
    const jobIndex = jobList.findIndex((t) => t.id == selectedJob);

    newArray.splice(jobIndex, 1);
    setJobList(newArray);

    (async () =>
      AsyncStorage.setItem('@SAVED_JOBS', JSON.stringify(newArray)))();

    setModalFlag(false);
  }

  const onJobSelect = (job) => {
    setModalFlag(true);
    setSelectedJob(job);
  };
  useEffect(() => {
    AsyncStorage.getItem('@SAVED_JOBS').then((res) => {
      const list = JSON.parse(res);
      setJobList(list);
    });
  }, [jobList]);
  const renderJobs = ({item}) => (
    <JobItem job={item} onSelect={() => onJobSelect(item)} />
  );

  return (
    <SafeAreaView>
      <View>
        <FlatList
          keyExtractor={(_, index) => index.toString()}
          data={jobList}
          renderItem={renderJobs}
          ListEmptyComponent={
            <Text style={IntroductionStyle.bannerText}>
              There is no saved jobs
            </Text>
          }
        />
        <Modal
          isVisible={modalFlag}
          onBackdropPress={() => setModalFlag(false)}>
          <View style={jobs.modalBackground}>
            <View style={{borderBottomWidth: 2, borderColor: '#bdbdbd'}}>
              <Text style={jobs.jobTitle}>{selectedJob.title}</Text>
              <Text>
                {selectedJob.location} / {selectedJob.title}
              </Text>
              <Text>{selectedJob.company}</Text>
            </View>
            <View style={jobs.jobDesc}>
              <WebView source={{html: selectedJob.description}} />
            </View>
            <Button title="Remove" color="red" onPress={removeJob} />
            <View style={{marginBottom: 10}}></View>
            <Button title="Close" onPress={() => setModalFlag(false)} />
          </View>
        </Modal>
      </View>
    </SafeAreaView>
  );
};

export {SavedJobs};
